import os
from classes.Fact import Fact
from classes.Rule import Rule
from classes.ErrorHandler import error_handler
from validation.validate import validate_line, validate_known_data


class Expert:
	def __init__(self, file_path, ui_flag):
		self.facts_flag = False
		self.known_facts = []
		self.queries = []
		self.rules = []
		self.facts = {}
		self.result = []

		self.path = file_path
		self.ui = ui_flag

	@staticmethod
	def get_known_data(line):
		data = []
		for char in line:
			data.append(char)
		return data

	@staticmethod
	def clean_up_line(line):
		if '#' in line:
			line = line.split('#')[0]
		for char in [' ', '\t', '\n', '\f', '\v']:
			if char in line:
				line = line.replace(char, '')

		return line

	@staticmethod
	def manage_implication(rule, rules_list):
		if '<=>' in rule:
			split = rule.split('<=>')
			new_rule = split[1] + '=>' + split[0]
			rules_list.append(new_rule)
			rule = rule.replace('<=>', '=>')
		rules_list.append(rule)
		return rules_list

	@staticmethod
	def convert_rule(rule):
		return '!({})=>!({})'.format(rule.implication, rule.condition)

	def validate_data(self):
		errors = validate_known_data(self.known_facts, self.queries, self.facts_flag)
		if errors or error_handler.errors:
			if errors:
				error_handler.errors['global'] = errors
			error_handler.throw_errors()

	def log_result(self):
		with open(os.path.join('..', 'result', 'log'), 'w') as f:
			for result in self.result:
				f.write(result + '\n')
				print result

	def validate_file(self):
		if self.ui == True:
			return True
		try:
			with open(self.path, 'r') as f:
				return True
		except IOError:
			error_handler.throw_error('global', 'File "{}" does not appear to exist.'.format(self.path))

	def parse_file(self):
		line_counter = 0

		if self.ui:
			split = self.path.split('\n')
			for line in split:
				line_counter += 1
				self.manage_line(line, line_counter)
		else:
			with open(self.path, 'r') as f:
				for line in f:
					line_counter += 1
					self.manage_line(line, line_counter)

	def manage_line(self, line, i):
		line = self.clean_up_line(line)
		if not line:
			return

		errors = validate_line(line)
		if errors:
			error_handler.errors[i] = errors
		first_char = line[0]
		if first_char == '=' or first_char == '?':
			if first_char == '=':
				self.facts_flag = True
				self.known_facts = self.get_known_data(line[1:])
			if first_char == '?':
				self.queries = self.get_known_data(line[1:])
		else:
			self.rules.append(line)

	def manage_facts(self):
		for fact in self.queries:
			self.facts[fact] = Fact(fact, self)
		for fact in self.known_facts:
			self.facts[fact] = Fact(fact, self)
			self.facts[fact].state = 'true'
			self.facts[fact].resolved = True

	def manage_rules(self):
		temp_rules_list = []
		for rule in self.rules:
			temp_rules_list = self.manage_implication(rule, temp_rules_list)

		self.rules = []
		for rule in temp_rules_list:
			self.rules.append(Rule(rule, self))

		for rule in self.rules:
			Rule(self.convert_rule(rule), self)

	def manage_queries(self):
		for query in self.queries:
			result = self.facts[query].resolve()
			if result == 'none':
				result = 'false (default)'
			self.result.append('{} is {}'.format(query, result))

from classes.Algorithm import Algorithm
from classes.Fact import Fact


def extract_new_facts(string):
	remove_list = ['!', '+', '|', '^', '(', ')', '\n']
	for char in remove_list:
		if char in string:
			string = string.replace(char, ' ')

	return string.split(' ')


class Rule(object):
	def __init__(self, rule, parent):
		super(Rule, self).__init__()
		self.condition = ''
		self.implication = ''

		self.parent = parent
		self.rule = rule
		self.algorithm = Algorithm(self.rule)
		self.process_rule()

	def process_rule(self):
		self.condition = self.algorithm.shunting_yard(self.algorithm.condition)
		self.implication = self.algorithm.shunting_yard(self.algorithm.implication)

		facts = extract_new_facts(self.algorithm.condition)
		self.collect_new_facts(facts, False)
		facts = extract_new_facts(self.algorithm.implication)
		self.collect_new_facts(facts, True)

	def collect_new_facts(self, facts, implication):
		for fact in facts:
			if len(fact) == 1:
				if not fact in self.parent.facts:
					self.parent.facts[fact] = Fact(fact, self.parent)
				if implication:
					# print fact, self.condition
					self.parent.facts[fact].dependencies.append(self)

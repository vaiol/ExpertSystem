from classes.Resolver import Resolver
from classes.ErrorHandler import error_handler


class Fact(object):
	def __init__(self, letter, parent):
		super(Fact, self).__init__()
		self.dependencies = []

		self.parent = parent
		self.letter = letter
		self.state = 'none'
		self.resolving = False
		self.resolved = False
		self.resolver = Resolver()

	@staticmethod
	def get_state(rules):
		rules = rules.items()
		result = None
		for key, val in rules:
			if result is None:
				result = key, val
			else:
				if result[1] == 'true' or result[1] == 'false':
					if val == 'true' or val == 'false' and val != result[1]:
						error_handler.throw_error('processing', 'Conflicting Rules')

					if val == 'true' or val == 'false' or val == 'undefined':
						result = key, val
		return result[1]

	def resolve(self):
		if self.resolved:
			return self.state
		if self.resolving:
			return 'undefined'

		true_rules = {}
		self.resolving = True
		if len(self.dependencies):
			for rule in self.dependencies:
				# print self.letter, len(self.dependencies), rule.condition, "--", rule.implication
				if self.resolver.evaluate_condition(rule.condition, self.parent.facts) == 'true':
					true_rules[rule] = self.resolver.evaluate_implication(rule.implication, self.parent.facts, self.letter, False)

			self.resolving = False
			if true_rules:
				self.state = self.get_state(true_rules)
			return self.state

		else:
			self.resolving = False
			self.resolved = True
			return self.state

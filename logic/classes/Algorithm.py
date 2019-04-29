from classes.ErrorHandler import error_handler


class Algorithm:
	def __init__(self, rule):

		self.operators = ['!', '+', '|', '^']
		self.brackets = ['(', ')']

		self.stack = []
		self.result = ''

		self.rule = rule

		split = rule.split('=>')
		self.condition = split[0]
		self.implication = split[1]

	def check_stack(self):
		return len(self.stack) > 0 and self.stack[-1] in self.operators

	def check_priority(self, operator):
		return self.operators.index(operator) >= self.operators.index(self.stack[-1])

	def shunting_yard(self, tokens):
		self.erase()
		for token in tokens:
			if token in self.operators:
				self.manage_operators(token)
			elif token in self.brackets:
				self.manage_brackets(token, tokens)
			else:
				self.result += token

		while len(self.stack):
			self.result += self.stack.pop()

		return self.result

	def manage_operators(self, operator):
		if len(self.stack) > 0:
			while self.check_stack() and self.check_priority(operator):
				self.result += self.stack.pop()
		self.stack.append(operator)

	def manage_brackets(self, bracket, line):
		if bracket == self.brackets[0]:
			self.stack.append(bracket)
			return
		elif bracket == self.brackets[1]:
			while len(self.stack) and self.stack[-1] != self.brackets[0]:
				self.result += self.stack.pop()
			if len(self.stack):
				self.stack.pop()
			else:
				error_handler.throw_error('processing', 'Mismatch parenthesis in "{}"'.format(line))

		while len(self.stack) and self.stack[-1] == '!':
			self.result += self.stack.pop()

	def erase(self):
		self.stack = []
		self.result = ''

from classes.ErrorHandler import error_handler


class Resolver:
	def __init__(self):
		self.operators = ['!', '+', '|', '^']
		self.stack = []
		self.operands = []

	@staticmethod
	def catch_error(operands, values):
		if 'true' in values and 'false' in values:
			error_handler.throw_error('processing', 'Contradictory statements "{}"'.format(operands))

	@staticmethod
	def get_operator(implication, token, counter, operator):
		expected_operands = 1
		if token != '!':
			expected_operands = 2
		counter += expected_operands
		if not operator:
			operator = token
			implication = implication[:-1]
		else:
			counter -= 1
		return operator, implication, counter

	@staticmethod
	def get_operands(index, implication):
		left_operand = implication[:((index - 1) * -1)]
		rest = implication[((index - 1) * -1):]
		return [left_operand, rest]

	@staticmethod
	def get_query(operands, fact):
		result = []
		for operand in operands:
			if fact in operand:
				result.append(operand)
		return result

	@staticmethod
	def _not(operands):
		status = operands[0]
		if status == 'true':
			return 'false'
		if status == 'false' or status == 'none':
			return 'true'
		if status == 'undefined':
			return 'undefined'
		pass

	@staticmethod
	def _and(operands):
		if 'false' in operands:
			return 'false'
		if operands[0] == 'true' and operands[1] == 'true':
			return 'true'
		if 'none' in operands:
			return 'none'
		if 'undefined' in operands:
			return 'undefined'

	@staticmethod
	def _or(operands):
		if 'true' in operands:
			return 'true'
		if 'none' in operands:
			return 'none'
		if 'undefined' in operands:
			return 'undefined'
		return 'false'

	@staticmethod
	def _xor(operands):
		if 'true' in operands and ('false' in operands or 'none' in operands):
			return 'true'
		if 'none' in operands:
			return 'none'
		if 'undefined' in operands:
			return 'undefined'
		return 'false'

	def implication_not(self, operands, facts, fact, converted_flag):
		operands = filter(None, operands)
		if len(operands) > 1:
			error_handler.throw_error('processing', 'To many operands "{}"'.format(operands))
		if converted_flag:
			return self.evaluate_implication(operands[0], facts, fact, False)
		return self.evaluate_implication(operands[0], facts, fact, True)

	def implication_and(self, operands, facts, fact, converted_flag):
		if converted_flag:
			return self.implication_or(['{}!'.format(operands[0]), '{}!'.format(operands[1])], facts, fact, False)
		operands = self.get_query(operands, fact)
		values = [self.evaluate_implication(operand, facts, fact, False) for operand in operands]
		self.catch_error(operands, values)
		return reduce(min, values)

	def implication_or(self, operands, facts, fact, converted_flag):
		if converted_flag:
			return self.implication_and(['{}!'.format(operands[0]), '{}!'.format(operands[1])], facts, fact, False)
		queries = self.get_query(operands, fact)
		if len(queries) == 0:
			error_handler.throw_error('processing', 'Unknown fact')
		if len(queries) == 1:
			operands.remove(queries[0])
			if self.evaluate_condition(operands[0], facts) != 'false':
				if self.evaluate_condition(queries[0], facts) != 'false':
					return 'undefined'
				return 'none'
			return self.evaluate_implication(queries[0], facts, fact, False)
		if len(queries) == 2:
			if self.evaluate_condition(operands[0], facts) == 'false':
				return self.evaluate_implication(operands[1], facts, fact, False)
			if self.evaluate_condition(operands[1], facts) == 'false':
				return self.evaluate_implication(operands[0], facts, fact, False)
			return 'undefined'

	def implication_xor(self, operands, facts, fact, converted_flag):
		if converted_flag:
			left_condition = '{}!{}!+'.format(operands[0], operands[1])
			right_condition = '{}{}+'.format(operands[0], operands[1])
			return self.implication_or([left_condition, right_condition], facts, fact, False)
		left_condition = '{}!{}+'.format(operands[0], operands[1])
		right_condition = '{}{}!+'.format(operands[0], operands[1])
		return self.implication_or([left_condition, right_condition], facts, fact, False)

	def make_operation_condition(self, token, operands):
		if token == '!':
			return self._not(operands)
		if token == '+':
			return self._and(operands)
		if token == '|':
			return self._or(operands)
		if token == '^':
			return self._xor(operands)

	def make_operation_implication(self, token, operands, facts, fact, converted_flag):
		if token == '!':
			return self.implication_not(operands, facts, fact, converted_flag)
		if token == '+':
			return self.implication_and(operands, facts, fact, converted_flag)
		if token == '|':
			return self.implication_or(operands, facts, fact, converted_flag)
		if token == '^':
			return self.implication_xor(operands, facts, fact, converted_flag)

	def evaluate_condition(self, condition, facts):
		self.stack = []
		for token in condition:
			self.operands = []
			if token in self.operators:
				expected_operands = 1
				if token != '!':
					expected_operands = 2
				if len(self.stack) < expected_operands:
					error_handler.throw_error('processing', 'Not enough operands for operator')
				while expected_operands:
					self.operands.append(self.stack.pop())
					expected_operands -= 1
				self.stack.append(self.make_operation_condition(token, self.operands))
			else:
				self.stack.append(facts[token].resolve())
		if len(self.stack) == 1:
			return self.stack[0]
		else:
			error_handler.throw_error('processing', 'Condition error "{}"'.format(condition))

	def evaluate_implication(self, implication, facts, fact, converted_flag):
		counter = 0
		current_operator = ''
		for index, token in enumerate(''.join(reversed(implication))):
			if token in self.operators and counter != 1:
				(current_operator, implication, counter) = self.get_operator(implication, token, counter, current_operator)
			else:
				if counter == 0:
					if index != len(implication) - 1:
						error_handler.throw_error('processing', 'Implication error "{}"'.format(implication))
					if token == fact:
						if converted_flag:
							return 'false'
						return 'true'
					if token in facts:
						if converted_flag:
							return self._not(facts[token])
						return facts[token]
					else:
						error_handler.throw_error('processing', 'Unknown fact "{}"'.format(token))
				elif counter == 1:
					operands = self.get_operands(index, implication)
					return self.make_operation_implication(current_operator, operands, facts, fact, converted_flag)
				else:
					counter -= 1

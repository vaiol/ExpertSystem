import sys, os


class ErrorHandler:
	def __init__(self):
		self.errors = {}

	@staticmethod
	def show_usage():
		usage = 'usage : [python main.py path/to/file]'
		with open(os.path.join('..', 'result', 'errors'), 'w') as f:
			f.write(usage)
		print(usage)
		sys.exit(1)

	@staticmethod
	def display_error(error_list, key):
		if not key in ['global', 'processing']:
			key = 'line {}'.format(key)
		print '\t{}:'.format(key)
		for error in error_list:
			print '\t\t{}'.format(error)
		# print error_list, key

	def throw_errors(self):
		keys = []
		print 'Errors:'
		with open(os.path.join('..', 'result', 'errors'), 'w') as f:
			for line in self.errors:
				keys.append(line)

			for key in sorted(keys):
				formatted_key = key
				if not key in ['global', 'processing']:
					formatted_key = '{} {}'.format('line', key)
				formatted_error = '{} {}'.format(formatted_key, self.errors[key])
				f.write(formatted_error + '\n')
				self.display_error(self.errors[key], key)
				# print formatted_error
		sys.exit(1)

	def throw_error(self, err_key, error):
		self.errors[err_key] = [error]
		self.throw_errors()


error_handler = ErrorHandler()

import sys, re
from classes.ErrorHandler import error_handler


def validate_args():
	if len(sys.argv) != 2:
		error_handler.show_usage()
	return True		# todo


def check_characters(line):
	pass


def validate_data(line, place):
	errors = []
	for char in line:
		# print line
		if not char.isupper():
			errors.append('Wrong character "{}" in {}'.format(char, place))
	return errors


def validate_chars(split, line):
	errors = []
	for item in split:
		wrong_chars = ''.join(re.split('[A-Z+()^!|?]+', item))
		for char in wrong_chars:
			errors.append('Wrong character "{}" in "{}"'.format(char, line))
	return errors


def validate_line(line):
	errors = []

	if line[0] == '=' or line[0] == '?':
		if line[0] == '=':
			errors += validate_data(line[1:], 'facts')

		if line[0] == '?':
			errors += validate_data(line[1:], 'queries')

	else:
		if '<=>' in line:
			split = line.split('<=>')
			if len(split) != 2:
				errors.append('Rule "{}" is not valid'.format(line))
			else:
				errors += validate_chars(split, line)

		elif '=>' in line:
			split = line.split('=>')
			if len(split) != 2:
				errors.append('Rule "{}" is not valid'.format(line))
			else:
				errors += validate_chars(split, line)

		else:
			errors.append('Rule "{}" is not valid'.format(line))

	if len(errors):
		return errors
	return False


def validate_known_data(facts, queries, fact_flag):
	errors = []
	if len(facts) == 0 and not fact_flag:
		errors.append('No facts')

	if len(queries) == 0:
		errors.append('No queries')

	if len(errors):
		return errors
	return False

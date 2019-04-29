import os
import sys
import shutil

from classes.Expert import Expert
from validation.validate import validate_args


def prepare():
	result_path = os.path.join('..', 'result')
	if os.path.exists(result_path):
		shutil.rmtree(result_path)
	os.mkdir(result_path)


def main():
	prepare()
	validate_args()
	expert = Expert(sys.argv[1], True)
	expert.validate_file()
	expert.parse_file()
	expert.validate_data()
	expert.manage_facts()
	expert.manage_rules()
	expert.manage_queries()
	expert.log_result()
	sys.exit(0)



main()

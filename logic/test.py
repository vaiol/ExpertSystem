import sys, os, subprocess

colors = {
	'red': '\033[93m',
	'green': '\033[92m',
	'blue': '\033[94m',
	'end_color': '\033[0m'
}


def main():
	for root, dirs, files in os.walk('tests'):
		for f in sorted(files):
			full_path = os.path.join(root, f)
			print '\n', colors['blue'] + 'TESTING' + colors['end_color'], full_path
			subprocess.call(['python', 'main.py', full_path])


if __name__ == '__main__':
	main()

from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in alazab_shop/__init__.py
from alazab_shop import __version__ as version

setup(
	name="alazab_shop",
	version=version,
	description="Property Management and Maintenance System",
	author="Alazab Solutions",
	author_email="alazab.architecture@outlook.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
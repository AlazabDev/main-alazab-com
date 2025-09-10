from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in azab_shop_revive/__init__.py
from azab_shop_revive import __version__ as version

setup(
	name="azab_shop_revive",
	version=version,
	description="Property Management and Maintenance System",
	author="Azab Solutions",
	author_email="admin@azabsolutions.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
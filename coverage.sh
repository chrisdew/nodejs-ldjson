#!/bin/bash
rm -rf lib-cov
jscoverage lib lib-cov
EXPRESS_COV=TRUE mocha --reporter html-cov > coverageReport.html
google-chrome coverageReport.html

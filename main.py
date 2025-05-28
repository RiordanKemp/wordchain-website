import arrr
from pyscript import document
import random
import os
import os.path
import re
import csv


def translate_english(event):
    input_text = document.querySelector("#english")
    english = input_text.value
    output_div = document.querySelector("#output")
    output_div.innerText = arrr.translate(english)
    rand_int = random.randrange(2, 1001)
    output_div.innerText = rand_int

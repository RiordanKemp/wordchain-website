from pyscript import document

import streamlit as st

import random
import os
import os.path
import re
import csv

openingStr = """Welcome to NAME PENDING (word chain??)!"""
difficultyDetails = "\nHard Mode requires child words to be +-1 in length relative to their parent."
hardmodeEnabled = "\nYou've chosen to play on Hard Mode."
hardmodeDisabled = "You've chosen to play Normal Mode."
exitMessage = "Thanks for playing! Exiting now..."
reset_message = "Resetting the round now.."
word_doesnt_exist_error = "This word does not exist."

difficultyOn = False

directory_str = "dict_directory"

alphabet_dict = {}
words_dict = {}
numb_dict = {}
starting_words_set = set()
already_used_words_set = set()
valid_letters_dict = {}

st.write("Hello world")


def translate_english(event):
    input_text = document.querySelector("#filltext")
    filltext = input_text.value
    output_div = document.querySelector("#output")
    rand_int = random.randrange(2, 1001)
    output_div.innerText = str(rand_int) + openingStr

def test_function(event):
    output_div = document.querySelector("#output")
    output_div.innerText = difficultyDetails
    output_div.style.visible = True

def normal_button(event):
    output_div = document.querySelector("#output")
    output_div.innerText = hardmodeDisabled


def hard_button(event):
    output_div = document.querySelector("#output")
    output_div.innerText = hardmodeEnabled
    input_text = document.querySelector("#filltext")
    

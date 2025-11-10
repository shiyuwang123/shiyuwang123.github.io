---
title: "A Great Manor of program user interface"
date: 2025-11-10 23:05:00 +0800
categories: [Diary]
math: true
---

When it comes to program designing, there are some aspects to evaluate the quality of a program. From the standpoint of users, the most important aspects are functionality and usability. Functionality is determined by the inner definitions of the classes, functions, inside libraries of the program, while usability is only determined by the user interface of the program. Paying attention to achieve better user interface is relatively easy, while often neglected by programmers. Let's discuss which manor of user interface is best.

Historically, there are two kinds of user interface: command line interface(CLI) and graphical user interface(GUI). Someone thinks GUI is better for users to easily control the program, however, the low-level process of a GUI program is still based on CLI commands, more importantly, the user experience of GUI is highly dependent on the quality of the design of the GUI. Some developers keep elegant and user-friendly GUI design like Apple, while some developers use ugly GUI frameworks like TCL/Tk or Tkinter to build ugly GUI programs. The quality of GUI is highly uneven, meanwhile, building a good GUI is a costly work, which requires a lot of cooperation between programmers and designers, which is only available to big companies. 

Traditional CLI programs rely on shell commands and standard input/output to interact with users like this:

```zsh
$name@machine my_program 
Please input your name: Alice
Hello, Alice!
```

if the program needs more complex input/output, it should use input/output files and inner parser. 

```zsh
$name@machine my_program input.txt
Processing input.txt...
Output written to output.txt
```

this manor makes it necessary for users to learn the usage of each programs and need to write input files in row format without LSP support.

From my own perspective, the best manor of user-interface is to use a programming language as the user interface, the most compatible one is Python. You can design your cpp language as the backend engine, and wrap the cpp functions with Python bindings using pybind11 or boost::python, then users can use python scripts to call your cpp program. This manor has several advantages:

1. Users can use the full power of Python language to control your program, including flow control, data structures, libraries and so on. This makes your program more flexible and powerful.
2. Users can use IDEs with LSP support to write python scripts, which can provide code completion, syntax highlighting, glossary and debugging features. This makes it easier for users to use your program without learning complex command line options or file formats.
3. Users can easily integrate your program with other Python libraries and tools, such as NumPy, Polars, VTK, torch and so on. This makes it easier for users to perform data analysis, visualization and other tasks besides using your program.
4. This manor not only provides python interface, but also keeps the cpp interface, advanced users can still include your cpp headers, call your functions and link to your libraries. This makes your program more versatile and appealing to different kinds of users.
5. This manor saves your development time and cost, since you don't need to design and implement a complex GUI or a inner parser for your program. You can focus on the core functionality of your program and let Python handle the user interface.

In conclusion, using a programming language like Python as the user interface of your program is a great manor of program usage. It combines the advantages of CLI and GUI, while avoiding their disadvantages. It provides users with more flexibility, power and ease of use, while saving your development time and cost. If you are designing a new program, I highly recommend you to consider this manor of user interface.
---
layout: post
title: "Running C++ in the Browser with WebAssembly"
---

This post demonstrates how to run a C++ function compiled to WebAssembly. We'll calculate a factorial.

### C++ Powered Factorial Calculator

<div>
  <label for="num">Enter a number (0-20):</label>
  <input type="number" id="num" value="7" min="0" max="20">
  <button id="calculateBtn">Calculate Factorial</button>
  <p>Result: <strong id="result">...</strong></p>
  <p id="greeting"></p>
</div>

<!--
  The 'my_math.js' script is loaded here. It will automatically load
  the 'my_math.wasm' file.
-->
<script async src="{{ '/assets/wasm/cpp/my_math.js' | relative_url }}"></script>

<script>
  // The 'Module' object is created by my_math.js.
  // We can hook into its 'onRuntimeInitialized' callback to know when the
  // Wasm module is ready to be used.
  var Module = {
    onRuntimeInitialized: function() {
      console.log('Emscripten runtime initialized.');

      // Use cwrap to create easy-to-use JavaScript wrappers for our C++ functions.
      // cwrap('function_name', 'return_type', ['argument_types'])
      const factorial = Module.cwrap('factorial', 'number', ['number']);
      const greet = Module.cwrap('greet', 'string', ['string']);

      const calculateBtn = document.getElementById('calculateBtn');
      const resultElement = document.getElementById('result');
      const numInput = document.getElementById('num');
      const greetingElement = document.getElementById('greeting');
      
      // Update greeting
      const name = "Jekyll Visitor";
      greetingElement.textContent = greet(name) + name;

      // Event listener for the button
      calculateBtn.addEventListener('click', () => {
        const num = parseInt(numInput.value, 10);
        const result = factorial(num); // Call the Wasm function!
        resultElement.textContent = result;
      });

      // Run once on load
      calculateBtn.click();
    }
  };
</script>

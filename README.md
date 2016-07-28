# clipboard

## usage

```
// html
<input id = "target" value = "https://github.com/liuhanqu/clipboard" readonly>
<button id = "trigger">复制</button>

// js 
new Clipboard({
  target: '#target', // selector of target element
  trigger: '#trigger', // selector of trigger element
  success: ()=> console.log('copy success') // callback when success
})
```


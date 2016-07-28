class Clipboard{
	constructor({
		trigger,  // string. selector of trigger element
		target = '',  // string. selector of target element
		action = 'copy',  // string. one value of ['copy', 'cut']
		clipboardText = '',  // string or number. clipboardText for there is not set target
		prompt = true,  // boolean. if true, show prompt when copy success. if not, do not show prompt.
		onSuccess = () => {},  // function.  callback when success
		onError = () => {}  // function.  callback when error
	}) {
		this.trigger = trigger;
		this.target = target;
		this.action = action;
		this.clipboardText = clipboardText;
		this.prompt = prompt;
		this.onSuccess = onSuccess;
		this.onError = onError;

		this.triggerEle = null;
		this.targetEle = null;
		this.fakeEle = null;
		this.timer = null;
		this.init();
	}

	handleAction(e) {
		if(this.timer) {
			return;
		}
		if(this.clipboardText) {
			this.selectFake();
		} else {
			this.selectTarget();
		}
			this.copyText();
	}

	copyText() {
		let successed;
		try {
			successed = document.execCommand(this.action);
		} catch(err) {
			successed = false;
		}
		this.handleCallback(successed);
	}

	handleCallback(successed) {
		this.clearSelection();
		if(!successed) {
			this.onError();
			return;
		}
		if(this.prompt) {
			this.showPrompt();
		}
		this.onSuccess();
	}

	showPrompt() {
		const target = this.triggerEle;
		const rect = target.getBoundingClientRect();
		const { top, right, left } = rect;
		const spanTop = top - (30 + 6);
		const spanLeft = left + (right - left) / 2;
		const spanEle = document.createElement('span');
		const iEle = document.createElement('i');
		const text = document.createTextNode('复制成功');
		spanEle.setAttribute('style', `
			color: #fff; 
			width: 70px; 
			height: 30px; 
			line-height: 30px;
			position: absolute;
			top: ${spanTop}px;
			left: ${spanLeft}px;
			transform: translate(-50%, 0);
			background-color: #000;
			border-radius: 4px;
			text-align: center;
			font-size: 14px;`
		);
		iEle.setAttribute('style', `
			width: 0;
			height: 0;
			border: 3px solid transparent;
			border-top-color: #000;
			position: absolute;
			bottom: -6px;
			left: 50%;
			transform: translate(-50%, 0);`
		);
		spanEle.appendChild(text);
		spanEle.appendChild(iEle);
		document.body.appendChild(spanEle);

		this.timer = setTimeout(()=>{
			document.body.removeChild(spanEle);
			this.timer = null;
		}, 2000);
	}

	selectFake() {
		let fakeEle  = this.fakeEle;
		if(!fakeEle) {
			fakeEle = document.createElement('input');
			fakeEle.setAttribute('style', 'position: absolute; left: -9999px; top: -9999px;');
			fakeEle.setAttribute('value', this.clipboardText);
			document.body.appendChild(fakeEle);
			this.fakeEle = fakeEle;
		}
		fakeEle.select();
	}

	removeFake() {
		document.body.removeChild(this.fakeEle);
	}

	selectTarget() {
		const { target } = this;
		const targetEle = this.targetEle = document.querySelector(target);
		if(targetEle.matches('input') || targetEle.matches('textarea')) {
			targetEle.select();
			return;
		}
		let range = document.createRange();
		range.selectNode(targetEle);
		window.getSelection().addRange(range);
	}

	clearSelection() {
		const { targetEle, fakeEle } = this;
		if(fakeEle) {
			fakeEle.blur();
		}
		if(targetEle) {
			targetEle.blur();
		}
		window.getSelection().removeAllRanges();
	}

	init() {
		const triggerEle = this.triggerEle = document.querySelector(this.trigger);
		triggerEle.addEventListener('click', this.handleAction.bind(this), false);
	}

	destroy() {
		this.removeFake();
		this.triggerEle = null;
		this.targetEle = null;
		this.fakeEle = null;
		this.timer = null;
	}
}

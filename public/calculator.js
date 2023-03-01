
'use strict';

function notImplemented(sym, ...args) {
  window.alert(`not implemented: ${sym}`);
  console.error('not implemented', sym, ...args);
}


const DATA = {
}


function bindElements(rootElement, controller) {
  rootElement.querySelectorAll('[data-sym]').forEach(function(element, index, arr) {
    const sym = element.getAttribute('data-sym');
    const handle = DATA[sym];
    if ( !handle ) {
      throw Error(`could not load symbol: ${sym}`);
    }
    element.onclick = (event) => {
      let { fn } = handle;
      if ( typeof fn !== 'function' ) {
        fn = controller[handle.fn];
      }
      if ( !fn ) {
        throw Error(`unknown function ${data.fn}`);
      }
      fn.call(controller, sym, event)
    };
  });
}

function CalculatorController(rootElement) {
  if ( !rootElement ) {
    throw Error('no root element given');
  }
  const displayTextEl = rootElement.querySelector('.displaytext > span');
  if ( ! displayTextEl ) {
    throw Error('no display element');
  }
  const model = new CalculatorModel()
  const render = () => {
    const { displayText } = model.state;
    displayTextEl.textContent = displayText;
    document.title = `Simple calculator: ${displayText}`;
  }
  const controller = {
    appendDigit(sym, click) {
      model.appendDigit(sym);
      render();
    },
    appendPeriod() {
      model.appendPeriod();
      render();
    },
    setEqual() {
      model.setEqual();
      render();
    },
    setOperation(sym) {
      model.setOperation(sym);
      render();
    },
  };

  bindElements(rootElement, controller);
  render();
  return controller;
}


function CalculatorModel() {
  const state = {
    displayText: '0',
    hasPeriod:false,
    start: true,
    arg0: undefined,
    fn: undefined,
  };
  return {
    state,
    appendDigit(digit) {
      const { displayText } = state;
      if ( displayText === '0' ) {
        state.displayText = digit;
        state.start = false;
      } else {
        if ( state.start ) {
          state.displayText = digit;
          state.start = false;
        } else {
          state.displayText += digit;
        }
      }
    },
    appendPeriod() {
      if ( !state.hasPeriod ) {
        state.hasPeriod = true
        if ( state.start ) {
          state.displayText = '0.';
          state.start = false;
        } else {
          state.displayText += '.';
        }
      }
    },
    executeOperation() {
      if ( state.arg0 === undefined || state.fn === undefined ) {
        return;
      }
      const arg1 = Number.parseFloat(state.displayText);
      let result;
      switch ( state.fn ) {
        case '+':
          result = state.arg0 + arg1;
          break;
        case '-':
          result = state.arg0 - arg1;
          break;
        case '*':
          result = state.arg0 * arg1;
          break;
        case '/':
          result = state.arg0 / arg1;
          break;
        default:
          throw Error(`unknown fn ${state.fn}`)
      }
      state.displayText = ''+result;
    },
    setEqual() {
      this.executeOperation();
      state.start = true;
      state.arg0 = undefined;
    },
    setOperation(sym) {
      if ( ! "+-*/".indexOf(sym) === -1 ) {
        throw Error(`unknown symbol ${sym}`);
      }
      if ( state.fn !== undefined && state.arg0 !== undefined ) {
        this.executeOperation();
      }
      state.start = true;
      state.arg0 = Number.parseFloat(state.displayText);
      state.fn = sym;
    },
  };
}


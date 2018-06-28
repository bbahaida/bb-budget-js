//#region BUDGET

var BudgetController = (function(){
    // some code
})();

//#endregion


//#region UI

var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn'
    }
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        getDOMStrings: function(){
            return DOMStrings;
        }
    };
})();

//#endregion

//#region App

var AppController = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();
        // Add button OnClickListener
        document.querySelector(DOM.addButton).addEventListener('click', addItem);

        // Return OnKeypressListener
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                addItem();
            }
        });
    }
    
    var addItem = function(){
        // 1. Get the field input data
        var input = UICtrl.getInput();

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI

    }

    return {
      init: function(){
          console.log('App started .....');
          setupEventListeners();
          
      }  
    };

    
})(BudgetController, UIController);

//#endregion


//#region Main function
function main(){
    AppController.init();
}

main();
//#endregion
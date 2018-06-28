//#region BUDGET

var BudgetController = (function(){

    
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, dsc, val){
            var newItem, ID, last;

            last = data.allItems[type][data.allItems[type].length - 1];

            ID = last ? last.id + 1 : 1;
            
            if(type === 'exp'){
                newItem = new Expense(ID,dsc,val);
            }else if(type === 'inc'){
                newItem = new Income(ID,dsc,val);
            }
            data.allItems[type].push(newItem);
            data.totals[type]+=val;
            return newItem;
        },
        testing: function(){
            console.log(data);
        }
        
    };

})();

//#endregion


//#region UI

var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomesContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        addListItem: function(type, obj){
            var html, newHtml, element;

            if(type === 'inc'){
                element = DOMStrings.incomesContainer;
                html = '<div class="item clearfix" id="income-%id%"> \
                            <div class="item__description">%description%</div> \
                            <div class="right clearfix"> \
                                <div class="item__value">+ %value%</div> \
                                <div class="item__delete"> \
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> \
                                </div> \
                            </div> \
                        </div>';
            }else if(type === 'exp'){
                element = DOMStrings.expensesContainer;                
                html = '<div class="item clearfix" id="expense-%id%"> \
                            <div class="item__description">%description%</div> \
                            <div class="right clearfix"> \
                                <div class="item__value">- %value%</div> \
                                <div class="item__percentage">21%</div> \
                                <div class="item__delete"> \
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> \
                                </div> \
                            </div> \
                        </div>';
            }

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        
        clearFilds: function(){
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription+', '+DOMStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(element){
                element.value = '';
            });

            fieldsArray[0].focus();
        },

        getDOMStrings: function(){
            return DOMStrings;
        },
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
        var item = budgetCtrl.addItem(input.type, input.description, parseFloat(input.value));

        // 3. Add the item to the UI
        UICtrl.addListItem(input.type, item);

        // 4. Clear fields
        UICtrl.clearFilds();

        // 5. Calculate the budget

        // 6. Display the budget on the UI
        

    }

    return {
      init: function(){
          console.log('App started .....');
          setupEventListeners();
          
          //document.querySelector(UICtrl.getDOMStrings().inputDescription).focus();
          
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
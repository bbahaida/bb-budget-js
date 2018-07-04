//#region BUDGET

var BudgetController = (function(){

    
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function(id,description,value, percentage){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = percentage;
    };

    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    var calculateBudget = function(){

        data.budget = data.totals.inc - data.totals.exp;
        data.percentage = calculatePercentage(data.totals.exp);
    }
    var calculatePercentage = function(value){
        return ((value/data.totals.inc)*100).toFixed(1)
    }

    return {
        addItem: function(type, dsc, val){
            var newItem, ID, last;

            if(type === 'exp' && data.totals['inc'] === 0){
                throw Error('can not add expenses from 0 income that result '+(1/0)+' in the percentage calculation');
            }

            last = data.allItems[type][data.allItems[type].length - 1];

            ID = last ? last.id + 1 : 1;
            
            if(type === 'exp'){

                newItem = new Expense(ID,dsc,val,calculatePercentage(val));
            }else if(type === 'inc'){
                newItem = new Income(ID,dsc,val);
            }
            data.allItems[type].push(newItem);
            data.totals[type]+=val;
            return newItem;
        },
        getBudget: function(){
            calculateBudget();
            return {
                budget: data.budget,
                income: data.totals.inc,
                expenses: data.totals.exp,
                percentage: data.percentage
            };
        },
        getData: function(){
            return data;
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
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpensesValue: '.budget__expenses--value',
        budgetTitleMonth: '.budget__title--month',
        budgetIncomePercentage: '.budget__income--percentage',
        budgetExpensesPercentage: '.budget__expenses--percentage',
    }

    function validateInput(){
        var tNode, dNode, vNode, t, d, v;

        tNode = document.querySelector(DOMStrings.inputType);
        dNode = document.querySelector(DOMStrings.inputDescription);
        vNode = document.querySelector(DOMStrings.inputValue);

        t = tNode.value;
        d = dNode.value;
        v = parseFloat(vNode.value);

        if(!(t && d && v)){
            if(!t){
                console.log('type must not be '+t);
                //tNode.focus();
            }else if(!d){
                console.log('description must not be '+d);
                dNode.focus();
            }else if(!v){
                console.log('value must not be '+v);
                vNode.focus();
            }
            return null;
        }

        return {
            type: t,
            description: d,
            value: v
        };
        
        
    }
    
    return {
        getInput: function(){

            return validateInput();
        },
        updateBudgetUI: function(income, expenses, percentage, total){
            var totalString;

            document.querySelector(DOMStrings.budgetIncomeValue).textContent = '+'+income;
            document.querySelector(DOMStrings.budgetExpensesValue).textContent = '-'+expenses;
            document.querySelector(DOMStrings.budgetExpensesPercentage).textContent = percentage+'%';
            
            if(total > 0){
                totalString = '+'+total;
            }else if(total < 0){
                totalString = total;
            }else{
                totalString = '0';
            }
            document.querySelector(DOMStrings.budgetValue).textContent = totalString;
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
                                <div class="item__percentage">%percentage%%</div> \
                                <div class="item__delete"> \
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> \
                                </div> \
                            </div> \
                        </div>';
            }

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);
            newHtml = type === 'exp' ? newHtml.replace('%percentage%',obj.percentage) : newHtml;
            
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
        document.querySelector(DOM.addButton).addEventListener('click', function(){
            try {
                addItem();
            } catch (error) {
                console.log(error.message);
            }
        });

        // Return OnKeypressListener
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                addItem();
            }
        });
    }

    var updateBudget = function(){
        var budget;

        // 1. Calculate the budget
        budget = budgetCtrl.getBudget();

        // 2. Display the budget on the UI

        UICtrl.updateBudgetUI(budget.income, budget.expenses, budget.percentage, budget.budget);

        


    }

    var getMonth = function(){
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";          
        month[5] = "June";
        month[6] = "July";       
        month[7] = "August";        
        month[8] = "September";       
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        return month[new Date().getMonth()];
    }

    var addItem = function(){
        // 1. Get the field input data
        var input, item;
        input = UICtrl.getInput();
        if(input){
            // 2. Add the item to the budget controller
            item = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(input.type, item);

            // 4. Clear fields
            UICtrl.clearFilds();

            // 5. Calculate and update the budget
            try {
                updateBudget();
            } catch (error) {
                console.log(error.message);
            }
            

        
        }

    }

    return {
      init: function(){
          var textContent;
          

          console.log('App started .....');
          setupEventListeners();
          
          document.querySelector(UICtrl.getDOMStrings().inputDescription).focus();

          document.querySelector(UICtrl.getDOMStrings().budgetValue).textContent = '0';
          document.querySelector(UICtrl.getDOMStrings().budgetIncomeValue).textContent = '+0';
          document.querySelector(UICtrl.getDOMStrings().budgetExpensesValue).textContent = '-0';
          document.querySelector(UICtrl.getDOMStrings().budgetExpensesPercentage).textContent = '0%';

          textContent = (document.querySelector(UICtrl.getDOMStrings().budgetTitleMonth).textContent).replace("%Month%", getMonth());

          document.querySelector(UICtrl.getDOMStrings().budgetTitleMonth).textContent = textContent;
          
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
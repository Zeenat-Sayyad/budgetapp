var budgetController=(function(){
// code about data structure
var Income=function(id,description,value){
this.id=id;
this.description=description;
this.value=value;
};
var Expense=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
    this.percentage=-1;
    };
   Expense.prototype.calcpercentage=function(totalIncome){
        if (totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100);

        }

   }
   Expense.prototype.getpercentage=function(){
       return this.percentage;
   }
var calculateTotal=function(type){
    var sum=0;
    data.allitem[type].forEach(function(cur){
        sum+=cur.value;

    })
    data.total[type]=sum;

};

    var data={
        allitem:{
           
            inc:[],
            exp:[]
        },
        total:{
          
            inc:0,
            exp:0,

        },
        budget:0,
        percentage:-1

    };

     return {
         addItem:function(type,des,val){
             var newItem,id;
             if(data.allitem[type].length>0)
             {
          id=data.allitem[type][data.allitem[type].length-1].id+1;
             }
             else{
                 id=0;
             }


             if(type==='inc'){
                newItem=new Income(id,des,val)
            }
           
             else if(type==='exp'){
                 newItem=new Expense(id,des,val)
             }
            data.allitem[type].push(newItem);
            return newItem;
         },
         CalculateBudget:function(type){
            //   calculate total expense and income
         
                 calculateTotal('inc');
                 calculateTotal('exp');
                //  calculate budget
             data.budget=   data.total.inc-data.total.exp;
            //  calculate percentage
            if(data.total.inc>0)
            {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            }
            // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100

         },
         getBudget:function(){
             return{
             budget : data.budget,
             totalinc : data.total.inc,
             totalexp : data.total.exp,
             percentage : data.percentage
              

             }

         },
       
         deleteItem:function(type, id){
             var ids,index;
            //  [12456]
            // data.allitems[type][id]
            //  index=6
            var ids=data.allitem[type].map(function(current){
                return current.id;


            });
            var index=ids.indexOf(id);
            if(index!==-1){
                data.allitem[type].splice(index,1);
            }


         },
         Calculatepercentages:function()
         {
           data.allitem.exp.forEach(function(cur){
               cur.calcpercentage(data.total.inc);
           })
         },
         getprcent:function()
         {
            var allperc=  data.allitem.exp.map(function(cur){
             return cur.getpercentage();
             })
            return allperc;
         },


         testing:function(){
             console.log(data);
         }
        
     }



})();

var UIController=(function()
{
    return{
        getinput:function(){
            return{
                type: document.querySelector(".add__type").value,
                description:document.querySelector('.add__description').value,
                value:parseFloat(document.querySelector('.add__value').value),

            }
        },
        addListItem:function(obj,type){
            var HTML,newHtml,element;
              // create HTML string
              if(type==='inc'){
                HTML='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>'
              element=document.querySelector(".income__list");
              }
              else if(type==='exp')
            {
                HTML=' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                element=document.querySelector(".expenses__list");

            }
          
            // Replace HTML string with place holder
newHtml=HTML.replace('%id%',obj.id);
newHtml = newHtml.replace('%description%', obj.description);
newHtml = newHtml.replace('%value%',obj.value);

 
            // add Item to DOM
            element.insertAdjacentHTML('beforeend',newHtml);
        },


        deleteListItem:function(selectorId){
            var e=document.getElementById(selectorId);
            e.parentNode.removeChild(e);






        },
        clearfeilds:function(){
            var feilds,feildsarray;

           feilds= document.querySelectorAll(".add__description ,.add__value")
            console.log(feilds);
           feildsarray=Array.prototype.slice.call(feilds);
            feildsarray.forEach(function(cur,index,array){
                cur.value="";
            });
            feildsarray[0].focus();
        },
        displayBudget:function(obj){
            document.querySelector(".budget__value").textContent=obj.budget;
            document.querySelector(".budget__income--value").textContent=obj.totalinc;
            document.querySelector(".budget__expenses--value").textContent=obj.totalexp;
            if(obj.percentage>0){
            document.querySelector(".budget__expenses--percentage").textContent=obj.percentage+" %";

            }
            else{
                document.querySelector(".budget__expenses--percentage").textContent="--";
 
            }

        },
        displayPercentages:function(percentages){
        var feilds=document.querySelectorAll(".item__percentage");
        var nodeListforeach=function(list,callback){
            for(i=0;i<list.length;i++)
            {
                callback(list[i],i)
            }
        };
        nodeListforeach(feilds,function(current,index)
        {

            if (percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
            } else {
                current.textContent = '---';
            }

        });

        },
        displayMonth:function(){
            var now,months,month,year;
            now=new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
           month=now.getMonth();
           year=now.getFullYear();
           document.querySelector(".budget__title--month").textContent=months[month]+' '+year;
             
        }
     
        }
       

})();

var controller=(function(budgetCtrl,UICtrl){
    var setupEventListener=function(){
        document.querySelector(".add__btn").addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
});
  document.querySelector(".container").addEventListener('click',ctrlDeleteItem);

    };


    // Updating budget
    var updateBudget=function(){
        // calculate update budget
    budgetController. CalculateBudget();
    // get the value of income and expense budget and percentage
    var budget=budgetController.getBudget();
        // update budget on UI

     UICtrl.displayBudget(budget);
    };

    // Updating Percentages

     var updatePercentages=function()
     {
        //  Calculate Percentages
      budgetController.Calculatepercentages();


        // Read the percentages

var percentages=budgetController.getprcent();
        // update the percentages in UI
        UIController.displayPercentages(percentages)

     };

  
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getinput();        
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl. clearfeilds();

            // 5. Calculate and update budget
            updateBudget();
            
            // 6. Calculate and update percentages
             updatePercentages();
        }




    };
var ctrlDeleteItem=function(event){

var itemId, splitId,type,id;
itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
if(itemId)
{
 splitId=itemId.split('-');
  type=splitId[0];
 id=parseInt(splitId[1]);


 budgetController.deleteItem(type,id);
 UIController.deleteListItem(itemId);
 updateBudget();
 // 6. Calculate and update percentages
 updatePercentages();
}


};

    
return{
    init:function(){
       UICtrl.displayBudget(
           {
               budget:0,
               totalinc:0,
               totalexp:0,
               percentage:-1



       }
       )

       
        console.log("application has started")
        setupEventListener();
        UIController.displayMonth();
    }
}



})(budgetController, UIController);
controller.init();
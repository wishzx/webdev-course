"use strict";


function cs142MakeMultiFilter(originalArray) {
    //spread operator to copy an array
    let currentArray = [...originalArray];




    let arrayFilterer = function (filterCriteria, callback) {
        if (typeof (filterCriteria) !== "function") {
            return currentArray;
        }

        currentArray = currentArray.filter(filterCriteria);
        if (typeof callback === "function") {

            //bind this inside callback to originalArray
            callback = callback.bind(originalArray);
            callback(currentArray);

        }
        return arrayFilterer;

    };


    return arrayFilterer;
}

// let originalArray = [1, 2, 3];

// function filterTwos(elem) { return elem !== 2; }
// function filterThrees(elem) { return elem !== 3; }


// let arrayFilterer = cs142MakeMultiFilter(originalArray);



// arrayFilterer(filterTwos,
//     function (currentArray) {
//         console.log(this);
//         console.log(currentArray);
//     });

// arrayFilterer(filterThrees);

// var currentArray = arrayFilterer();
// console.log(currentArray);

// var arrayFilterer2 = cs142MakeMultiFilter([1, 2, 3]);
// var currentArray2 = arrayFilterer2(filterTwos)(filterThrees)();
// console.log('currentArray2', currentArray2);   // prints [1] since we filtered out 2 and 3

// // Multiple active filters at the same time
// var arrayFilterer3 = cs142MakeMultiFilter([1, 2, 3]);
// var arrayFilterer4 = cs142MakeMultiFilter([4, 5, 6]);
// console.log(arrayFilterer3(filterTwos)());	// prints [1,3]
// console.log(arrayFilterer4(filterThrees)());	// prints [4,5,6]
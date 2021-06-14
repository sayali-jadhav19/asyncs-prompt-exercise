function wait(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function destroyPopup(popup) {
    popup.classList.remove('open');
    await wait(1000);
    //remov the popup entirely!
    popup.remove();
    popup = null;
}

function ask(options) {
    return new Promise(async function(resolve) {
        //First we need to create a poupwith all the fields in it
        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.insertAdjacentHTML('afterbegin',`
            <fieldset>
                <label>${options.title}</label>
                <input type="text" name="input"/>
                <button type="submit">Submit</button>
            </fieldset>
        `);

        //check if they want a cancel button
        if(options.cancel) {
            const skipButton = document.createElement('button');
            skipButton.type = 'button';
            skipButton.textContent = 'Cancel';
            console.log(popup.firstChild);
            popup.firstElementChild.appendChild(skipButton);

            //listen for a click on that cancel button
            skipButton.addEventListener(
                'click',
                function() {
                    resolve(null);
                    destroyPopup(popup);
                },
                { once: true }
            );
        }

        //listen for the submit event on the inuts

        popup.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('SUBMITTED');
            resolve(e.target.input.value);
            // resolve it from the DOM entirely
            destroyPopup(popup);
        },
        { once: true }
        );

        //when someone does submit it,resolve the data that was i the input box
   
        //insert that popup into theDOM
        document.body.appendChild(popup);
        //put a very small timeout before we add the oprn class
        await wait(50);
        popup.classList.add('open');
        
    });
}

//select all button that have a question
async function askQuestions(e) {

    const button = e.currentTarget;
    const cancel = 'cancel' in button.dataset;

    const answer = await ask({
         title: button.dataset.question,
        cancel,
        });
    console.log(answer);
}
const buttons = document.querySelectorAll('[data-question]');
buttons.forEach(button => button.addEventListener('click', askQuestions));

const questions = [
    { title: 'What is your name?' },
    { title: 'What is your age?', cancel: true },
    { title: 'What is your dogs name?' },
];

async function asyncMap(array, callback) {
    const results = [];
    for(const item of array) {
        const result = await callback(item);
        results.push(result);

    }
    return results;
}

async function go() {
    const answers = await asyncMap(questions, ask);
    console.log(answers);
}
go();
// async function askMany() {
//     for (const question of questions) {
//         const answer = await ask(question);
//         console.log(answer);
//     }
// }

// askMany();



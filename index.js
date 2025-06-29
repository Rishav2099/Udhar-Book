let person_name = document.getElementById('name')
let price = document.getElementById('price')

let pay_btn = document.querySelector('.pay_btn')
let receive_btn = document.querySelector('.receive_btn')

let udharRecords = []

const addUdhar = (udhar) => {
    const record = document.createElement('div');
    record.className = 'record';

    record.innerHTML = `
        <p>${udhar.name}</p>
        <div class="record_price_container">
          <p>₹ <span style="color: ${udhar.isReceiveable ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'};" class="price">${udhar.price}</span></p>
          <div>
            <button class="less">-</button>
            <input class="update_price" placeholder="₹ 00.00" type="number" />
            <button class="add">+</button>
          </div>
        </div>
        <span class="material-symbols-outlined more_vert"> more_vert </span>
        <div class="delete">
          <p style="font-size: medium; cursor: pointer;">Delete</p>
          <button style="border: none; margin: 5px" type="button" aria-label="Close">
            <span aria-hidden="true" class="close">&times;</span>
          </button>
        </div>
    `;

    const records = document.querySelector('.records');
    records.appendChild(record);

    const deleteBtnDiv = record.querySelector('.delete');
    const moreBtn = record.querySelector('.more_vert');

    moreBtn.addEventListener('click', () => {
        deleteBtnDiv.style.display = deleteBtnDiv.style.display === 'flex' ? 'none' : 'flex';
    });

    const closeBtn = record.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        deleteBtnDiv.style.display = 'none';
    });

    const deleteTextBtn = deleteBtnDiv.querySelector('p');
    deleteTextBtn.addEventListener('click', () => {
        record.remove();
        udharRecords = udharRecords.filter(item =>
            !(item.name === udhar.name && item.price === udhar.price && item.isReceiveable === udhar.isReceiveable)
        );
        localStorage.setItem('udhar', JSON.stringify(udharRecords));
    });

    // ⭐ Price update logic
    const priceEl = record.querySelector('.price');
    const updateInput = record.querySelector('.update_price');
    const addBtn = record.querySelector('.add');
    const lessBtn = record.querySelector('.less');

    const updatePrice = (isAdd) => {
        const value = parseFloat(updateInput.value);
        if (isNaN(value) || value <= 0) return;

        let newPrice = parseFloat(priceEl.textContent);
        newPrice = isAdd ? newPrice + value : newPrice - value;

        // Negative price avoid
        if (newPrice < 0) newPrice = 0;

        priceEl.textContent = newPrice;

        // Update udharRecords
        const index = udharRecords.findIndex(item =>
            item.name === udhar.name && item.price == udhar.price && item.isReceiveable === udhar.isReceiveable
        );
        if (index !== -1) {
            udharRecords[index].price = newPrice;
            localStorage.setItem('udhar', JSON.stringify(udharRecords));
        }

        // Clear input
        updateInput.value = '';
    };

    addBtn.addEventListener('click', () => updatePrice(true));
    lessBtn.addEventListener('click', () => updatePrice(false));
};


const getUdhar = () => {
    let udhars = JSON.parse(localStorage.getItem('udhar')) || []
    udharRecords = udhars
    udharRecords.forEach(udhar => {
        addUdhar(udhar)
    });
}

getUdhar()

const addUdharToLocaleStorage = (e) => {
    e.preventDefault()

    if (person_name.value.length === 0 || price.value.length === 0) return;

    const udhar = {
        name: person_name.value,
        price: price.value,
        isReceiveable: e.target.className == "receive_btn"
    }

    udharRecords.push(udhar)
    addUdhar(udhar)
    localStorage.setItem('udhar', JSON.stringify(udharRecords))

    person_name.value = ''
    price.value = 0

    console.log(udharRecords);

}

receive_btn.addEventListener('click', (e) => {
    addUdharToLocaleStorage(e)
})

pay_btn.addEventListener('click', (e) => {
    addUdharToLocaleStorage(e)
})
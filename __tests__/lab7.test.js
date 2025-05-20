describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    expect(numProducts).toBe(20);
  });

  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    let allArePopulated = true;

    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        return data = item.data;
      });
    });

    for (let i = 0; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i+1}/${prodItemsData.length}`);

      let item = prodItemsData[i];
      if (!item.title || item.title.length === 0) { allArePopulated = false; }
      if (!item.price || item.price.toString().length === 0) { allArePopulated = false; }
      if (!item.image || item.image.length === 0) { allArePopulated = false; }
    }

    expect(allArePopulated).toBe(true);
  }, 10000);

  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    const productItem = await page.$('product-item');
    
    const buttonInitialText = await page.evaluate(item => {
      const shadowRoot = item.shadowRoot;
      const button = shadowRoot.querySelector('button');
      return button.innerText;
    }, productItem);
    
    expect(buttonInitialText).toBe('Add to Cart');
    
    await page.evaluate(item => {
      const shadowRoot = item.shadowRoot;
      const button = shadowRoot.querySelector('button');
      button.click();
    }, productItem);
    
    const buttonAfterClickText = await page.evaluate(item => {
      const shadowRoot = item.shadowRoot;
      const button = shadowRoot.querySelector('button');
      return button.innerText;
    }, productItem);
    
    expect(buttonAfterClickText).toBe('Remove from Cart');
  }, 2500);

  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    const productItems = await page.$$('product-item');
    
    for (const item of productItems) {
      const buttonText = await page.evaluate(el => {
        const shadowRoot = el.shadowRoot;
        const button = shadowRoot.querySelector('button');
        const text = button.innerText;
        if (text === 'Add to Cart') {
          button.click();
        }
        return text;
      }, item);
    }
    
    const cartCountValue = await page.$eval('#cart-count', el => el.innerText);
    
    expect(parseInt(cartCountValue)).toBe(20);
  }, 10000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();
    
    const productItems = await page.$$('product-item');
    
    for (const item of productItems) {
      const buttonText = await page.evaluate(el => {
        const shadowRoot = el.shadowRoot;
        const button = shadowRoot.querySelector('button');
        return button.innerText;
      }, item);
      
      expect(buttonText).toBe('Remove from Cart');
    }
    
    const cartCountValue = await page.$eval('#cart-count', el => el.innerText);
    
    expect(parseInt(cartCountValue)).toBe(20);
  }, 10000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    
    const cartItems = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    
    const expectedCart = '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]';
    
    expect(cartItems).toBe(expectedCart);
  });

  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');
    
    const productItems = await page.$$('product-item');
    
    for (const item of productItems) {
      await page.evaluate(el => {
        const shadowRoot = el.shadowRoot;
        const button = shadowRoot.querySelector('button');
        if (button.innerText === 'Remove from Cart') {
          button.click();
        }
      }, item);
    }
    
    const cartCountValue = await page.$eval('#cart-count', el => el.innerText);
    
    expect(parseInt(cartCountValue)).toBe(0);
  }, 10000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    
    await page.reload();
    
    const productItems = await page.$$('product-item');
    
    for (const item of productItems) {
      const buttonText = await page.evaluate(el => {
        const shadowRoot = el.shadowRoot;
        const button = shadowRoot.querySelector('button');
        return button.innerText;
      }, item);
      
      expect(buttonText).toBe('Add to Cart');
    }
    
    const cartCountValue = await page.$eval('#cart-count', el => el.innerText);
    
    expect(parseInt(cartCountValue)).toBe(0);
  }, 10000);

  
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    
    const cartItems = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    
    const expectedCart = '[]';
    
    expect(cartItems).toBe(expectedCart);
  });
});

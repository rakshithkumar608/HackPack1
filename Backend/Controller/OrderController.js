const Order = require('../Schemas/OrderSchema');
const User = require('../Schemas/UserSchema');

/**
 * Create a BUY order: validates input, creates Order, links to user
 * Expected body: { userId, symbol, orderQuantity, price }
 */
const buyOrder = async (req, res) => {
  try {
    const { userId, symbol, orderQuantity, price } = req.body;

    if (!userId || !symbol || !orderQuantity || !price) {
      return res.status(400).json({ message: 'userId, symbol, orderQuantity and price are required' });
    }

    const qty = Number(orderQuantity);
    const pr = Number(price);
    if (!Number.isFinite(qty) || qty <= 0) return res.status(400).json({ message: 'orderQuantity must be a positive number' });
    if (!Number.isFinite(pr) || pr < 0) return res.status(400).json({ message: 'price must be a non-negative number' });

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create order document
    const order = new Order({
      userId: user._id,
      orderQuantity: qty,
      symbol: String(symbol).trim().toUpperCase(),
      price: pr,
      orderType: 'BUY',
      status: 'COMPLETED'
    });

    await order.save();

    // Push order reference to user's orders array
    user.orders = user.orders || [];
    user.orders.push(order._id);
    await user.save();

    return res.status(201).json({ message: 'Buy order created', order });
  } catch (err) {
    console.error('buyOrder error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

module.exports = {
  buyOrder,
};


const BUY  = async (req , res)=> {
    
}
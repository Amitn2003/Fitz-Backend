const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z } = require('zod');

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  age: z.number().int().positive(),
  gender: z.enum(['male', 'female', 'other']),
  height: z.number().positive(),
  weight: z.number().positive(),
  weightGoal: z.number().positive(),
  mainGoal: z.enum(['weight gain', 'weight loss', 'muscle gain', 'strength training', 'general fitness']),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  preferredWorkoutSplit: z.enum(['full body', 'upper/lower', 'push/pull/legs', 'bro split', 'custom']),
});

exports.registerUser = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    console.log(validatedData, "Validate user")
    const user = new User(validatedData);
    console.log(user, "0User")
    await user.save();
    console.log(user, "User")
    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    
    // Remove sensitive information before sending user data
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.log(error)
      res.status(500).json({ message: 'Error registering user' });
    }
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email });
    console.log(user)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    
    // Remove sensitive information before sending user data
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ token, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

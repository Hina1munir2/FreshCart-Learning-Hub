const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");

const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

const courses = [
  {
    title: "Understanding Organic Foods",
    description:
      "Learn what organic food means, how organic products are produced, and how to make informed choices when shopping.",
    category: "Organic Foods",
    instructor: "FreshCart Learning Team",
    duration: "3 weeks",
    level: "Beginner",
    image: "",
    videoUrl: "https://www.youtube.com/watch?v=organic-foods",
    published: true,
  },
  {
    title: "Seasonal Recipes for Healthy Eating",
    description:
      "Discover how to choose seasonal ingredients and prepare simple, fresh recipes throughout the year.",
    category: "Seasonal Recipes",
    instructor: "FreshCart Learning Team",
    duration: "4 weeks",
    level: "Beginner",
    image: "",
    videoUrl: "https://www.youtube.com/watch?v=seasonal-recipes",
    published: true,
  },
  {
    title: "Sustainable Shopping Basics",
    description:
      "Learn practical ways to reduce food waste, choose sustainable products, and make environmentally responsible shopping decisions.",
    category: "Sustainable Shopping",
    instructor: "FreshCart Learning Team",
    duration: "3 weeks",
    level: "Beginner",
    image: "",
    videoUrl: "https://www.youtube.com/watch?v=sustainable-shopping",
    published: true,
  },
  {
    title: "Smart Grocery Shopping",
    description:
      "Learn how to plan your grocery trips, compare products, reduce unnecessary purchases, and shop more responsibly.",
    category: "Sustainable Shopping",
    instructor: "FreshCart Learning Team",
    duration: "4 weeks",
    level: "Intermediate",
    image: "",
    videoUrl: "https://www.youtube.com/watch?v=smart-shopping",
    published: true,
  },
];

const lessons = [
  // Understanding Organic Foods
  {
    title: "What Does Organic Mean?",
    description:
      "Understand the basic meaning of organic food and how organic farming differs from conventional farming.",
    videoUrl: "https://www.youtube.com/watch?v=organic-foods",
    duration: "8 minutes",
    order: 1,
  },
  {
    title: "Reading Organic Labels",
    description:
      "Learn how to recognize organic labels and understand what they tell you about a product.",
    videoUrl: "https://www.youtube.com/watch?v=organic-labels",
    duration: "10 minutes",
    order: 2,
  },
  {
    title: "Benefits of Organic Produce",
    description:
      "Explore the benefits of organic produce and how it can fit into everyday shopping.",
    videoUrl: "https://www.youtube.com/watch?v=organic-benefits",
    duration: "12 minutes",
    order: 3,
  },

  // Seasonal Recipes
  {
    title: "Why Eat Seasonal Foods?",
    description:
      "Learn why seasonal ingredients can be fresh, flavorful, and useful for planning healthy meals.",
    videoUrl: "https://www.youtube.com/watch?v=seasonal-foods",
    duration: "8 minutes",
    order: 1,
  },
  {
    title: "Choosing Seasonal Ingredients",
    description:
      "Learn how to identify seasonal fruits and vegetables when planning your grocery list.",
    videoUrl: "https://www.youtube.com/watch?v=seasonal-ingredients",
    duration: "10 minutes",
    order: 2,
  },
  {
    title: "Simple Seasonal Recipes",
    description:
      "Explore simple recipe ideas using fresh seasonal ingredients.",
    videoUrl: "https://www.youtube.com/watch?v=seasonal-recipes",
    duration: "15 minutes",
    order: 3,
  },

  // Sustainable Shopping
  {
    title: "Reducing Food Waste",
    description:
      "Learn simple habits that can help reduce food waste at home.",
    videoUrl: "https://www.youtube.com/watch?v=food-waste",
    duration: "10 minutes",
    order: 1,
  },
  {
    title: "Choosing Sustainable Products",
    description:
      "Understand how product choices can affect the environment and learn practical shopping tips.",
    videoUrl: "https://www.youtube.com/watch?v=sustainable-products",
    duration: "12 minutes",
    order: 2,
  },
  {
    title: "Reusable and Responsible Shopping",
    description:
      "Learn how reusable bags, containers, and thoughtful purchasing habits can support sustainable shopping.",
    videoUrl: "https://www.youtube.com/watch?v=reusable-shopping",
    duration: "9 minutes",
    order: 3,
  },

  // Smart Grocery Shopping
  {
    title: "Planning Your Grocery Trip",
    description:
      "Learn how to create a practical shopping plan before visiting the store.",
    videoUrl: "https://www.youtube.com/watch?v=grocery-planning",
    duration: "9 minutes",
    order: 1,
  },
  {
    title: "Making Better Product Choices",
    description:
      "Learn how to compare products and make informed purchasing decisions.",
    videoUrl: "https://www.youtube.com/watch?v=product-choices",
    duration: "11 minutes",
    order: 2,
  },
  {
    title: "Building Sustainable Shopping Habits",
    description:
      "Put your knowledge together and create sustainable shopping habits for everyday life.",
    videoUrl: "https://www.youtube.com/watch?v=shopping-habits",
    duration: "13 minutes",
    order: 3,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove existing development seed data
    await Lesson.deleteMany({});
    await Course.deleteMany({});

    // Create courses
    const createdCourses = await Course.insertMany(courses);

    console.log(`${createdCourses.length} courses inserted`);

    // Connect lessons to their courses
    const lessonsWithCourses = lessons.map((lesson, index) => {
      let courseIndex;

      if (index < 3) {
        courseIndex = 0;
      } else if (index < 6) {
        courseIndex = 1;
      } else if (index < 9) {
        courseIndex = 2;
      } else {
        courseIndex = 3;
      }

      return {
        ...lesson,
        course: createdCourses[courseIndex]._id,
      };
    });

    // Create lessons
    const createdLessons = await Lesson.insertMany(lessonsWithCourses);

    console.log(`${createdLessons.length} lessons inserted`);

    console.log("FreshCart Learning Hub seed completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

seedDatabase();
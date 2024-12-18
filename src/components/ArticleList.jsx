import React from "react";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

const ArticleList = React.memo(({ articles, filters }) => {
  if (articles.length === 0) {
    return (
      <div>
        <img className="w-full h-[400px] object-cover" src="src\images\nonews people.webp" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <motion.div
          key={article.url}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
        >
          <img
            src={article.urlToImage || "https://via.placeholder.com/300x200"}
            alt={article.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {article.description}
            </p>
            <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold mr-2 mb-2">
                {article.source}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold mr-2 mb-2">
                {article.category || "Uncategorized"}
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold mb-2">
                {new Date(article.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <a
              target="_blank"
              href={article.url}
              className="block mt-4 text-center bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-blue-600"
            >
              Read More
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

export default ArticleList;

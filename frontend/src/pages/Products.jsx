import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function BookPlaceholder({ name }) {
  return (
    <div className="book-placeholder">
      <span>BOOKSTORE</span>
      <strong>{name}</strong>
    </div>
  );
}

function ProductImage({ product }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!product.imageUrl || imageFailed) {
    return <BookPlaceholder name={product.name} />;
  }

  return (
    <img
      className="product-image"
      src={product.imageUrl}
      alt={product.name}
      onError={() => setImageFailed(true)}
    />
  );
}

function ProductCard({
  product,
  onAddToCart,
  onViewRelated,
  showRelatedButton = true,
}) {
  const inStock = Number(product.stockQuantity) > 0;

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <ProductImage product={product} />

        <span
          className={`stock-badge ${
            inStock ? "in-stock" : "out-of-stock"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.category?.name || "Books"}</span>

          {product.brand?.name && (
            <>
              <span className="meta-dot">•</span>
              <span>{product.brand.name}</span>
            </>
          )}
        </div>

        <h2>{product.name}</h2>

        <p className="product-description">
          {product.description ||
            "Discover this title in our bookstore collection."}
        </p>

        <div className="product-price-row">
          <div>
            <span className="price-label">Price</span>

            <strong className="product-price">
              ₹{Number(product.price).toFixed(2)}
            </strong>
          </div>

          <span className="stock-count">
            {product.stockQuantity} available
          </span>
        </div>

        <div className="product-actions">
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            disabled={!inStock}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          {showRelatedButton && (
            <button
              type="button"
              className="secondary-action"
              onClick={() => onViewRelated(product)}
            >
              Related Books
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("info");

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [brandFilter, setBrandFilter] = useState("all");

  const [relatedProducts, setRelatedProducts] =
    useState([]);

  const [relatedTo, setRelatedTo] = useState("");

  const [relatedLoading, setRelatedLoading] =
    useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await api.get("/products");

        setProducts(response.data);
        setError("");
      } catch (err) {
        console.error(err);

        setError(
          "We couldn't load the book catalogue. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const categoryNames = products
      .map((product) => product.category?.name)
      .filter(Boolean);

    return [...new Set(categoryNames)].sort();
  }, [products]);

  const brands = useMemo(() => {
    const brandNames = products
      .map((product) => product.brand?.name)
      .filter(Boolean);

    return [...new Set(brandNames)].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const productDescription =
        product.description?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        productName.includes(query) ||
        productDescription.includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category?.name === categoryFilter;

      const matchesBrand =
        brandFilter === "all" ||
        product.brand?.name === brandFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    brandFilter,
  ]);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setMessageType("warning");

      setMessage(
        "Please sign in before adding a book to your cart."
      );

      return;
    }

    try {
      await api.post(`/cart/${userId}/items`, {
        productId,
        quantity: 1,
      });

      setMessageType("success");
      setMessage("Book added to your cart successfully.");
    } catch (err) {
      console.error(err);

      setMessageType("error");

      setMessage(
        err.response?.data?.message ||
          "Unable to add this book to your cart."
      );
    }
  };

  const handleRelatedProducts = async (product) => {
    try {
      setRelatedLoading(true);
      setRelatedProducts([]);
      setRelatedTo(product.name);
      setMessage("");

      const response = await api.get(
        `/products/${product.id}/related`
      );

      setRelatedProducts(response.data);

      window.setTimeout(() => {
        document
          .getElementById("related-books")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (err) {
      console.error(err);

      setMessageType("error");
      setMessage("Unable to load related books.");
    } finally {
      setRelatedLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setBrandFilter("all");
  };

  if (loading) {
    return (
      <div className="catalogue-state">
        <div className="loading-spinner" />

        <h2>Loading books...</h2>

        <p>Preparing the catalogue for you.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalogue-state error-state">
        <span className="state-icon">!</span>

        <h2>Something went wrong</h2>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <section className="page-header">
        <div>
          <span className="page-eyebrow">
            Book Catalogue
          </span>

          <h1>Find your next great read.</h1>

          <p>
            Explore our collection of technology,
            programming, cloud and software books.
          </p>
        </div>

        <div className="catalogue-count">
          <strong>{products.length}</strong>

          <span>
            {products.length === 1 ? "Book" : "Books"}
          </span>
        </div>
      </section>

      <section className="catalogue-toolbar">
        <div className="search-field">
          <label htmlFor="book-search">
            Search catalogue
          </label>

          <input
            id="book-search"
            type="search"
            placeholder="Search by title or description..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="filter-field">
          <label htmlFor="category-filter">
            Category
          </label>

          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
          >
            <option value="all">
              All categories
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="brand-filter">
            Publisher
          </label>

          <select
            id="brand-filter"
            value={brandFilter}
            onChange={(event) =>
              setBrandFilter(event.target.value)
            }
          >
            <option value="all">
              All publishers
            </option>

            {brands.map((brand) => (
              <option
                key={brand}
                value={brand}
              >
                {brand}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="clear-filter-button"
          onClick={clearFilters}
        >
          Clear
        </button>
      </section>

      {message && (
        <div
          className={`catalogue-message ${messageType}`}
        >
          <span>{message}</span>

          {messageType === "success" && (
            <Link to="/cart">View Cart →</Link>
          )}

          {messageType === "warning" && (
            <Link to="/login">Sign In →</Link>
          )}
        </div>
      )}

      <div className="results-summary">
        <p>
          Showing{" "}
          <strong>{filteredProducts.length}</strong>{" "}
          {filteredProducts.length === 1
            ? "book"
            : "books"}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="catalogue-state">
          <span className="state-icon">⌕</span>

          <h2>No books found</h2>

          <p>
            Try changing your search term or catalogue
            filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <section className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewRelated={
                handleRelatedProducts
              }
            />
          ))}
        </section>
      )}

      {relatedTo && (
        <section
          id="related-books"
          className="related-section"
        >
          <div className="related-heading">
            <div>
              <span className="page-eyebrow">
                You may also like
              </span>

              <h2>
                Related to “{relatedTo}”
              </h2>
            </div>

            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                setRelatedTo("");
                setRelatedProducts([]);
              }}
            >
              Close
            </button>
          </div>

          {relatedLoading ? (
            <div className="catalogue-state compact">
              <div className="loading-spinner" />

              <p>Finding related books...</p>
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className="catalogue-state compact">
              <p>
                No related books are available yet.
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  showRelatedButton={false}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Products;
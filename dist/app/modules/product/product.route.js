"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const adminVerify_1 = __importDefault(require("../../../middleware/adminVerify"));
const productRoute = express_1.default.Router();
// all Routes
productRoute.post("/create-product", adminVerify_1.default, product_controller_1.createProduct);
productRoute.post("/create-offer", adminVerify_1.default, product_controller_1.createOffer);
productRoute.get("/all-products", product_controller_1.allProduct);
productRoute.get("/search-products", product_controller_1.getFiltredPorduct);
productRoute.get("/search-products-admin", product_controller_1.getFiltredPorductFromAdmin);
productRoute.get("/single-products/:id", product_controller_1.getSinglePorduct);
productRoute.get("/offer-products/:id", product_controller_1.getOfferProduct);
productRoute.get("/offer-products", product_controller_1.OfferProduct);
productRoute.get("/offer-products-banner", product_controller_1.OfferProductBanner);
productRoute.get("/search-offer-products", product_controller_1.searchOfferProducts);
productRoute.get("/all-offer-products", product_controller_1.allOfferProduct);
productRoute.get("/trending-products", product_controller_1.TrendingProduct);
productRoute.get("/best-selling-products", product_controller_1.bestSellingProduct);
productRoute.get("/new-arrival", product_controller_1.newArrival);
productRoute.get("/best-reviews", product_controller_1.Review);
productRoute.get("/rattings", product_controller_1.Rattings);
productRoute.get("/sub-categorywise-product/:id", product_controller_1.getSubCategoryWizeProducts);
productRoute.put("/update-banner", adminVerify_1.default, product_controller_1.updateBannerImage);
productRoute.put("/update-offer-banner", adminVerify_1.default, product_controller_1.updateOfferBannerImage);
productRoute.put("/delete-slider-img", adminVerify_1.default, product_controller_1.deleteSingleImg);
productRoute.put("/update-product-info", adminVerify_1.default, product_controller_1.updateProductInfo);
productRoute.put("/update-multiple-img", adminVerify_1.default, product_controller_1.updateMultipleImg);
productRoute.delete("/delete-product/:id", adminVerify_1.default, product_controller_1.deleteProduct);
productRoute.delete("/delete-offer-product/:id", adminVerify_1.default, product_controller_1.deleteOfferProduct);
exports.default = productRoute;

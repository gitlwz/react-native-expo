import { onThemeChange, onShowCustomThemeView, onThemeInit } from "./theme";
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from "./popular";
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from "./trending";
import { onLoadFavoriteData } from "./favorite";
import { onSearch,onSearchCancel,onLoadMoreSearch } from "./search";
import { onLoadLanguage } from "./language";
export default {
    onThemeChange,
    onShowCustomThemeView,
    onThemeInit,
    onRefreshPopular,
    onLoadMorePopular,
    onFlushPopularFavorite,
    onRefreshTrending,
    onLoadMoreTrending,
    onFlushTrendingFavorite,
    onLoadFavoriteData,
    onLoadLanguage,
    onSearch,
    onSearchCancel,
    onLoadMoreSearch
}
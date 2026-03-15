import ApiService from "./api.service";

class FiiService extends ApiService {
  async getFii(ticker) {
    return this.request("get", `fii/${ticker}`);
  }

  async getAllFIIs({ page = 1, pageSize = 50, sorting = [], columnFilters = [], search = "" } = {}) {
    const params = new URLSearchParams({ page, per_page: pageSize });
    if (sorting.length > 0) {
      params.set("sort_by", sorting[0].id);
      params.set("sort_dir", sorting[0].desc ? "desc" : "asc");
    }
    if (columnFilters.length > 0) {
      params.set("filters", JSON.stringify(columnFilters));
    }
    if (search) {
      params.set("search", search);
    }
    return this.request("get", `fiis?${params.toString()}`);
  }

  async addFavorite(fiiId) {
    return this.request("post", `favorites/fii/${fiiId}`);
  }

  async removeFavorite(fiiTicker) {
    return this.request("delete", `favorites/fii/${fiiTicker}`);
  }

  async getFavorites(page = 1, perPage = 50) {
    return this.request("get", `favorites/fii?page=${page}&per_page=${perPage}`);
  }

  async editFavorite(favoriteId, newData) {
    return this.request("put", `favorite/fii/${favoriteId}`, newData);
  }

  async updateFIIs() {
    return this.request("put", "fiis/update-fiis");
  }
}

const fiiServiceInstance = new FiiService();
export default fiiServiceInstance;

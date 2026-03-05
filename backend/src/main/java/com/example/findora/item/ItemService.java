package com.example.findora.item;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> searchItems(String keyword, String category) {
        String cleanedKeyword = normalizeKeyword(keyword);
        String normalizedCategory = normalizeCategory(category);
        return itemRepository.searchItems(cleanedKeyword, normalizedCategory);
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }
        return keyword.trim();
    }

    private String normalizeCategory(String category) {
        if (category == null || category.isBlank()) {
            return null;
        }

        return category
                .trim()
                .replace(" ", "")
                .replace("/", "")
                .toLowerCase(Locale.ROOT);
    }
}

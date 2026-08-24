package de.roman.speiseplan.dish;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DishRepository extends JpaRepository<Dish, Long> {
    @Query("select d from Dish d where "
            + "(:search is null or lower(d.name) like lower(concat('%', :search, '%'))) "
            + "and (:tag is null or lower(d.tags) like lower(concat('%', :tag, '%'))) "
            + "order by d.createdAt desc")
    List<Dish> search(@Param("search") String search, @Param("tag") String tag);

    Optional<Dish> findByOwnerEmailAndClientId(String ownerEmail, String clientId);
}
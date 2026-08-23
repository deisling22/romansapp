package de.roman.speiseplan.creator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "creator")
public class Creator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 80)
    private String handle;

    @Column(nullable = false, length = 500)
    private String bio;

    @Column(name = "avatar_url", nullable = false, length = 500)
    private String avatarUrl;

    @Column(name = "reel_image_url", nullable = false, length = 500)
    private String reelImageUrl;

    protected Creator() {
    }

    public Creator(String name, String handle, String bio, String avatarUrl, String reelImageUrl) {
        this.name = name;
        this.handle = handle;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.reelImageUrl = reelImageUrl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getHandle() {
        return handle;
    }

    public String getBio() {
        return bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getReelImageUrl() {
        return reelImageUrl;
    }
}
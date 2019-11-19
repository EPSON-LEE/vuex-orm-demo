import { Model } from "@vuex-orm/core";

// User Model
export class User extends Model {
  static entity = "User";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      sex: this.string("male"),
      height: this.number(""),
      weight: this.number(""),
      school: this.string("").nullable(), // 可以为 null
      active: this.boolean(false).nullable(),
      clothes: this.hasMany(Clothes, "clothes_id"),
      rand: this.attr(() => Math.random()) // this.attr 表示可以为任何值 -》 类似于 ts 中的 any
    };
  }
}

// Profile Model
export class Profile extends Model {
  static entity = "Profile";

  static fields() {
    return {
      id: this.string(""),
      user_id: this.attr(null),
      profile_id: this.number("").nullable(),
      user: this.belongsTo(User, "user_id"),
      profile: this.string("").nullable()
    };
  }
}

// Clothes Model
export class Clothes extends Model {
  static entity = "Clothes";

  static fields() {
    return {
      id: this.string(""),
      clothes_id: this.attr(""),
      user_id: this.number("").nullable(),
      color: this.string("").nullable(),
      size: this.number("").nullable()
    };
  }
}

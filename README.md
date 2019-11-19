# vuex-orm-demo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## 定义数据类型

[ORM 实例教程](http://www.ruanyifeng.com/blog/2019/02/orm-tutorial.html)

模型字段的基本类型

|  Type   | 含义  |
|  ----  | ----  |
| this.attr("")  | 任意值 |
| this.string("")  | 字符串 |
| this.number("")  | 数字 |
| this.boolean("")  | 布尔值 |

特殊类型

|  Type   | 含义  |
| nullable  | 空值 |
| this.increment()  | 自增 |

关系类型

## 数据模型

### 模型间的关系

Vuex-Orm 定义了几种关系用来描述数据模型之间的关系

|  关系   | 写法  |  含义  |
|  ----  | ----  |  ----  |
| One to One | this.hasOne(Profile, 'user_id') | 一个数据对象拥有一个数据对象 |
| One to One Inverse | this.belongTo(User, 'user_id') | 一个数据模型中包含另一个数据对象 |
| One to One Inverse | this.belongTo(User, 'user_id') | 一个数据模型归属于一个数据对象 |
| One to Many | this.belongTo(User, 'user_id') | 一个数据对象属多种另一个类型的数据对象（归属方） |
| Has Many By | this.hasManyBy(Node, 'user_ids') | 一个数据对象属多种另一个类型的数据对象（被归属方） |
| Many To  Many | roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id') | 角色和用户之间的关系：一个角色拥有多个用户，一个用户同样会拥有多种角色 |
| Has Many Through | posts: this.hasManyThrough(Post, User, 'country_id', 'user_id') | 一个村落拥有许多邮政局作为桥梁来互相沟通 |
| One To One (Polymorphic) | image: this.morphOne(Image, 'imageable_id', 'imageable_type') | 见下文解释|
| One To Many (Polymorphic) |  | 见下文解释|
| Many To Many (Polymorphic) |  | 见下文解释|


hasManyThrough 例子
```
this.hasManyThrough(
  Post,               // Final model we wish to access.
  User,               // Intermediate model.
  'country_id',       // Foreign key on User model.
  'user_id',          // Foreign key on Post model.
  'local_country_id', // Local key on Country model.
  'local_user_id'     // Local key on User model.
)
```

morphOne 一张图片可以属于一个用户，也可以属于一个评论。
```
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string(''),
      image: this.morphOne(Image, 'imageable_id', 'imageable_type')
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      title: this.string(''),
      image: this.morphOne(Image, 'imageable_id', 'imageable_type')
    }
  }
}

class Image extends Model {
  static entity = 'images'

  static fields () {
    return {
      id: this.attr(null),
      url: this.attr(''),
      imageable_id: this.attr(null),
      imageable_type: this.attr(null)
    }
  }
}

```


One To Many (Polymorphic)
```
class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      post_title: this.string(''),
      comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
    }
  }
}

class Video extends Model {
  static entity = 'videos'

  static fields () {
    return {
      id: this.attr(null),
      video_link: this.string(''),
      comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
    }
  }
}

class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      body: this.attr(''),
      commentable_id: this.attr(null),
      commentable_type: this.attr(null)
    }
  }
}
```

Many To Many (Polymorphic)
```
class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    }
  }
}

class Video extends Model {
  static entity = 'videos'

  static fields () {
    return {
      id: this.attr(null),
      tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    }
  }
}

class Tag extends Model {
  static entity = 'tags'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}

class Taggable extends Model {
  static entity = 'taggables'

  static fields () {
    return {
      id: this.attr(null),
      tag_id: this.attr(null),
      taggable_id: this.attr(null),
      taggable_type: this.attr(null)
    }
  }
}
```

this.morphedByMany()
```
class Tag extends Model {
  static entity = 'tags'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      posts: this.morphedByMany(
        Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type'
      ),
      videos: this.morphedByMany(
        Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type'
      )
    }
  }
}
```

### 继承


## 数据

在没有引入Vuex Orm 之前， 我们往往是通过操作 mutations 来对一个对象进行增、删、改、查，数据关系简单操作起来还行，但是一旦数据结构稍微复杂一些写起来就有些繁琐痛苦来
。Vuex Orm 会对 Store 中的数据进行持久化，通过已经定义好的数据模型使得 CURD 更加遍历写法更加优雅。

### 插入操作

视图
```
<script>
import User from '@/models/User'

export default {
  created () {
    User.insert({
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Johnny' }
      ]
    })
  } 
}
</script>
```

Vuex Store 经过更新后

```
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' },
        2: { id: 2, name: 'Jane' },
        3: { id: 3, name: 'Johnny' }
      }
    }
  }
}
```

create 方法和 insert 效果一致，他们的区别是 create 会清空之前的数据是一个全量更新

```
// Let's say this is the initial State.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' }
      }
    }
  }
}

// `insert` is going to insert a new record, and keep existing data.
User.insert({
  data: { id: 2, name: 'Jane' }
})

// State after `insert`.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' },
        2: { id: 2, name: 'Jane' }
      }
    }
  }
}

// `create` is going to replace all existing data with new data.
User.create({
  data: { id: 3, name: 'Johnny' }
})

// State after `create`.
{
  entities: {
    users: {
      data: {
        3: { id: 3, name: 'Johnny' }
      }
    }
  }
}
```

### 插入数据模型

数据模型
```
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      posts: this.hasMany(Post, 'user_id')
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      title: this.attr('')
    }
  }
}
```

插入数据模型
```
// Create User data with its related Post data.
User.insert({
  data: {
    id: 1,
    name: 'John Doe ',
    posts: [
      { id: 1, user_id: 1, title: 'Post title 1' },
      { id: 2, user_id: 1, title: 'Post title 2' }
    ]
  }
})

// State after `insert`.
{
  entities: {
    posts: {
      data: {
        1: { id: 1, user_id: 1, title: 'Post title 1' }
        2: { id: 2, user_id: 1, title: 'Post title 2' }
      }
    },
    users: {
      data: {
        1: { id: 1, name: 'John Doe' }
      }
    }
  }
}
```

### 更新操作

根据 primary key 来更新
```
<template>
  <div>
    <label>Name</label>
    <input :value="user.name" @input="updateName">
  </div>
</template>

<script>
import User from '@/models/User'

export default {
  computed: {
    user () {
      return User.find(1)
    }
  },

  methods: {
    updateName (e) {
      User.update({
        where: 1,
        data: {
          name: e.target.value
        }
      })
    }
  }
}
</script>
```

根据条件来筛
```
// Initial State.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20, active: false },
      2: { id: 2, name: 'Jane', age: 20, active: false },
      3: { id: 3, name: 'Johnny', age: 30, active: false }
    }
  }
}

// Update via function.
User.update({
  where: (user) => {
    return user.age === 20
  },

  data: { active: true }
})

// State after `update`.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20, active: true },
      2: { id: 2, name: 'Jane', age: 20, active: true },
      3: { id: 3, name: 'Johnny', age: 30, active: false }
    }
  }
}
```
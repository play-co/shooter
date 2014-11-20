# Shooter library

This library provides a set of classes to make it extremely easy
to implement a space-invaders style shooter in the GameClosure DevKit.

Include this library in your project by adding the following to
the dependencies object in your app's manifest.json:

```
"devkit-shooter": "https://github.com/gameclosure/shooter#v2.0.0"
```

Now, running `devkit install` will download this library and install
it in the modules folder.

You can now import things directly from this library using the shooter path:
```
import shooterGame as Game;
```

Check out the [Shooter Demo Game](https://github.com/gameclosure/demoShooter)
for a detailed example of building a full shooter game on top of this library.

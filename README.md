# richTextTagOverlayHelpers

! This is more of a demonstration for an approach rather than a finished drop-in library.



The code snippets manage marked-up text passages while also allowing for rich-text-formatting. 

So one can do this:

![Example Text with sections highlighted in different colors as well as with different letter formatting (italic)](https://user-images.githubusercontent.com/3416487/107265300-659c6200-6a44-11eb-87b1-d099d73b8f56.png)

(Which is only an example rendering, the code only does deal with abstract data structures)

It also can handle editing the text while maintaining the tags and formatting by reflecting changeset-changes in both the formatted text as well as the tagged text  (I think I used the quill editor, but I guess any changeset producing editor should work with some adapter code).

This all works by having the text, the data for text formatting and the data for the tags separately.

For rendering the text on screen (or rather, the creation of data for this), the code takes these 3 data sources and combines them,  chopping the text up into parts that can be separately formatted and carry both information about their tags as well as their formatting: The text example in the image above would result as 5 different nodes: "Some"(normal, yellow), "inter" (italic, yellow), "esting" (italic, (yellow, pink), "info" (normal, pink), "rmation" (normal, no code).

I hope it is useful for people creating text analysis UIs as quite some UIs I came accross do not show overlapping markup and/or do not allow people to edit the source text once they started with text analysis and/or do not allow to format the text itself.

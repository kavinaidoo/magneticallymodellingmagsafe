# Magnetically Modelling MagSafe

Magnetic Models of Apple's (iPhone) MagSafe Magnet Array (excluding the clocking magnet)

### Files in this repo

__p5.js version__
* hosted via GitHub pages [here](https://kavinaidoo.github.io/magneticallymodellingmagsafe/)
* 2D model, interactive - used to visualise forces

__Magpylib version__
* [Magnetically_Modelling_MagSafe_magpylib.ipynb](https://github.com/kavinaidoo/magneticallymodellingmagsafe/blob/main/Magnetically_Modelling_MagSafe_magpylib.ipynb) - Magnetic model using [magpylib](https://github.com/magpylib/magpylib)
* 3D model - used to visualise/calculate magnetic fields
* Only tested with Google Colab

__matplotlib version__
* [Magnetically_Modelling_MagSafe_2D_Animation.ipynb](https://github.com/kavinaidoo/magneticallymodellingmagsafe/blob/main/Magnetically_Modelling_MagSafe_2D_Animation.ipynb)
* 2D Model - used to visualise forces
* uses a hacky/ugly clear_output animation method
* Superseded by p5.js version

### How to have a play

To use the p5.js version
* [Click here](https://kavinaidoo.github.io/magneticallymodellingmagsafe/)

To interactively modify the p5.js version
* Open p5.js web editor - https://editor.p5js.org/
* Replace the contents of the web editor with the contents of [script.js](https://github.com/kavinaidoo/magneticallymodellingmagsafe/blob/main/script.js)

To use the magpylib and matplotlib versions, import into Google Colab:
* Open https://colab.research.google.com/
* Click GitHub
* Paste this repo's URL into the search box and choose the relevant ipynb file

### More Info

Read this for more context, fun animations etc ->  https://kavi.sblmnl.co.za/magnetically-modelling-magsafe/

PRs/Issues/Code optimization suggestions welcome! 

MagSafe is a trademark of Apple Inc.
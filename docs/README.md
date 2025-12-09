# File Element

**File** is a gh-element that was created for [GudHub no code development platform](https://gudhub.com) it is intended for uploading, saving, and displaying [files](../Rest_API/file.md) in applications. To upload a file, click on the field and select a file in the local folder. You can also drag a file into the field.

>A file can be uploaded to a field only if [Input](#input) interpretation type is enabled.

![Using the file element](./images/file-element.gif "File")

After the file is uploaded to the field, it will be uploaded to the server. There, its **name will be replaced with the file ID and a link to access the file will be generated**. The original file name is stored in another property.

>The file is saved in the application even after deletion from the field.

## Functional Characteristics

The only purpose of the element is to allow users to upload files to applications. This can be used to transfer files to another user or to collect files in an application. You can also upload pictures of various formats, as well as other media files that the [Image](./image.md) element does not process, such as videos, gifs, psd files, etc.

>The **File** has **no restrictions on the file formats that can be uploaded**.

## Element Options

The file element options consists of two blocks. Each of them has only two options.

### Field Settings

File field settings contains only standard Field Name and Name Space.

![Settings of the file field](./images/file-field-settings.jpg "File field settings")

### Type

The **Type** is setting that allows you to set how many values the current element can accept. That is, depending on the option selected, the user can upload either only one file or several files to the element.

![Type of the file](./images/file-type.jpg "File type")

Name|Description
:---|:---
Single|sets that the element can store only one file
Multiple|sets that the user can add multiple files to the field

## Element Style

File element has a standard set of style options and its own interpretations about that you can read in [Setting Overview](../Understanding_Gudhub/GH_Element/setting_overview.md) and below in [Interpretation section](#interpretation) respectively.

![Style of the file element](./images/file-element-style.jpg "File element style")

## Filtration

The only filter that can filter out items by files is [Value](../Core_API/Filter/value.md).

## Interpretation

The file element has a quite big list of interpretation types.

![Types of the file interpretation](./images/file-interpretation-types.jpg "File interpretation types")

### Input

This is the interpretation type that allows upload files in application and display them as icons with an original filename.

![Icons of different files](./images/file-icons.jpg "File icons")

Also, it allows to download file after clicking on it.

### Icon

This interpretation simply displays the standard icon. It is an uneditable type.

### Url

This type allows to display files URL that was generated in application. After clicking the file will be opened in a new browser window.

### File name

As you may have gathered, this interpretation allows to display in application only original filenames. It also works as a link after clicking and opens file in a new browser window.

### Value

This is the type of interpretation that displays a link to the file generated in GudHub.

## Value Format

File value format is a file ID that points to the object from file list. Due to that, the gh-element takes all needed data about file and gives an instruments for updating and displaying it.

```json
{
    "field_value": "928019"
}
```

## Data Model

File data model contains not only element settings, but also file options.

```json
{
    "data_model":{
        "display_mode": "single",
        "interpretation": []
    }
}
```

Name|Type|Description
:---|:---|:---
display_mode|`string`|*shows the number of files which can be added and displayed in the element*
interpretation|`array`|*contains all file interpretations*

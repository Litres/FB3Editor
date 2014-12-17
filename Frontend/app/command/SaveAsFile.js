/**
 * Сохраняет книгу локально.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.SaveAsFile',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data,
				result;

			data = me.data;
			var b = new Blob(["Содержиоме книги FB3"]);
			console.log(b);
			var fs = window.saveAs(b, "file_name");
			console.log(fs);
			//result = FBEditor.file.Manager.saveFB3(data.evt);

			return result;
		},

		unExecute: function ()
		{
			//
		}
	}
);
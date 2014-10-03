/**
 * Открывает файл.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.OpenFile',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data,
				file,
				result;

			result = false;
			data = me.data;
			file = FBEditor.file.Manager.getFileFromEvent(data.evt);
			if (file)
			{
				result = file.read(
					{
						type: file.LOAD_TYPE_TEXT,
						load: function (text)
						{
							Ext.getCmp('main-htmleditor').fireEvent('loadtext', text);
						}
					}
				);
			}

			return result;
		},

		unExecute: function ()
		{
			// закрывает открытый файл
		}
	}
);
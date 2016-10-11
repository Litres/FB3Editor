/**
 * Сохраняет тело.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.SaveBody',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.data,
				result = false,
				editorManager = data.editorManager,
				diff = FBEditor.util.Diff.getInstance(),
				content,
				xml,
				oldXml,
				revision;

			try
			{
				revision = editorManager.getRevision();
				oldXml = revision.getXml();
				content = editorManager.getContent();
				xml = content.getXml();
				console.log('save body', diff.getDiff(oldXml, xml));
			}
			catch (e)
			{
				Ext.log({level: 'error', msg: 'Ошибка сохранения тела книги', dump: e});
				Ext.Msg.show(
					{
						title: 'Ошибка',
						message: e,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}

			return result;
		},

		unExecute: function ()
		{
			//
		}
	}
);
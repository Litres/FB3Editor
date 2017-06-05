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
				btn = me.data.btn,
				bridgeWindow = me.getBridgeWindow(),
				editorManager = FBEditor.getEditorManager(true),
				descManager = bridgeWindow.FBEditor.desc.Manager,
				content,
				activePanel,
				result;

			// предусмотрено на будущее
			//btn.disable();

			try
			{
				if (editorManager.isLoadUrl() && !descManager.isLoadUrl())
				{
					// запоминаем активную панель
					content = bridgeWindow.Ext.getCmp('panel-main-content');
					activePanel = content.getLayout().getActiveItem();

					// если описание еще не было загружено по url, то загружаем
					descManager.loadFromUrl().then(
						function ()
						{
							// переключаем обратно на активную панель
							content.setActiveItem(activePanel);

							// сохраняем книгу
							me.save();
						}
					);

					result = true;
				}
				else
				{
					result = me.save();
				}
			}
			catch (e)
			{
				btn.enable();

				Ext.log(
					{
						level: 'error',
						msg: e,
						dump: e
					}
				);

				Ext.Msg.show(
					{
						title: 'Ошибка сохранения',
						message: e.message ? e.message : 'Невозможно сохранить книгу',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
				result = false;
			}

			return result;
		},

		unExecute: function ()
		{
			//
		},

		/**
		 * Сохраняет книгу.
		 * @return {Boolean}
		 */
		save: function ()
		{
			var me = this,
				btn = me.data.btn,
				desc = me.data.desc,
				bodyEditor,
				bodyManager,
				cover,
				descValues,
				descXml,
				bodyXml,
				fb3data,
				result;

			if (!desc.isValid())
			{
				throw Error('Некорректно заполнено описание книги');
			}

			// обложка
			cover = FBEditor.resource.Manager.getCover();

			descValues = desc.getValues();
			descXml = FBEditor.desc.Manager.getXml(descValues);

			// редактор тела книги
			bodyEditor = Ext.getCmp('main-editor');
			bodyManager = bodyEditor.getManager();
			bodyXml = bodyManager.getXml();

			fb3data = {
				thumb: cover,
				meta: FBEditor.desc.Manager.getMetaXml(descValues),
				books: [
					{
						desc: descXml,
						bodies: [
							{
								content: bodyXml,
								images: FBEditor.resource.Manager.getResources()
							}
						]
					}
				]
			};

			result = FBEditor.file.Manager.saveFB3(
				fb3data,
				function ()
				{
					// предусмотрено на будущее
					Ext.log(
						{
							level: 'warn',
							msg: 'Стали доступны методы FileSaver.onwriteend, FileSaver.onabort'
						}
					);

					btn.enable();
				}
			);

			return result;
		}
	}
);
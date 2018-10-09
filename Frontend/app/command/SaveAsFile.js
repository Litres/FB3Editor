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
				result;

			// предусмотрено на будущее
			//btn.disable();

			try
			{
				result = me.save();
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
                result = true,
				resources,
				bodyEditor,
				bodyManager,
				cover,
				descValues,
				descXml,
				bodyXml,
				fb3data;

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

			resources = FBEditor.resource.Manager.getResources();

			//console.log('resources', resources);
			//console.log('cover', cover);

			// получаем мету
            FBEditor.desc.Manager.getMetaXml(descValues).then(
            	function (meta)
				{
                    fb3data = {
                        thumb: cover,
                        meta: meta,
                        books: [
                            {
                                desc: descXml,
                                bodies: [
                                    {
                                        content: bodyXml,
                                        images: resources
                                    }
                                ]
                            }
                        ]
                    };

                    // сохраняем
                    FBEditor.file.Manager.saveFB3(
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
				}
			);

			return result;
		}
	}
);
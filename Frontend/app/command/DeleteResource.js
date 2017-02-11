/**
 * Удаляет ресурс.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.DeleteResource',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = me.data,
				resourceManager = bridge.FBEditor.resource.Manager,
				resourceName = data.nameResource,
				resource,
				result = false;

			try
			{
				resource = resourceManager.getResource(resourceName);

				if (!resource)
				{
					throw Error('Ресурс ' + resourceName + ' не найден');
				}

				if (resource.isFolder)
				{
					if (resourceManager.containsCover(resource))
					{
						Ext.Msg.confirm(
							'Удаление папки',
							'Данная папка содержит обложку книги. Вы уверены, что хотите её удалить?',
							function (btn)
							{
								if (btn === 'yes')
								{
									me.deleteResource(resourceName);
								}
							}
						);
					}
					else
					{
						me.deleteResource(resourceName);
					}
				}
				else
				{
					if (resource.isCover)
					{
						Ext.Msg.confirm(
							'Удаление ресурса',
							'Данный ресурс является обложкой книги. Вы уверены, что хотите его удалить?',
							function (btn)
							{
								if (btn === 'yes')
								{
									me.deleteResource(resourceName);
								}
							}
						);
					}
					else if (resource.elements.length)
					{
						Ext.Msg.confirm(
							'Удаление ресурса',
							'Данный ресурс используется в теле книги. Вы уверены, что хотите его удалить?',
							function (btn)
							{
								if (btn === 'yes')
								{
									me.deleteResource(resourceName);
								}
							}
						);
					}
					else
					{
						me.deleteResource(resourceName);
					}
				}
			}
			catch (e)
			{
				Ext.log(
					{
						level: 'error',
						msg: e,
						dump: e
					}
				);
				Ext.Msg.show(
					{
						title: 'Ошибка',
						message: 'Невозможно удалить ресурс ' + (e ? '(' + e + ')' : ''),
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}

			return result;
		},

		unExecute: function ()
		{
			// восстанавливает удаленный ресурс
		},

		/**
		 * Удаляет ресурс через менеджер ресурсов.
		 * @param {String} resourceName Имя ресурса.
		 * @return {Boolean} Успешно ли удален.
		 */
		deleteResource: function (resourceName)
		{
			var bridge = FBEditor.getBridgeWindow(),
				resourceManager = bridge.FBEditor.resource.Manager,
				result;
			
			if (resourceManager.isLoadUrl())
			{
				resourceManager.deleteFromUrl(resourceName);
				result = true;
			}
			else
			{
				result = resourceManager.deleteResource(resourceName);
			}
			
			return result;
		}
	}
);
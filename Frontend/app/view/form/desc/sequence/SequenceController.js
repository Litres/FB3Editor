/**
 * Контроллер серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.SequenceController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.sequence',

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				customContainer = view.getCustomContainer(),
				searchContainer = view.getSearchContainer();

			customContainer.setHidden(true);
			searchContainer.setVisible(true);
		},

		/**
		 * Делает актвиной кнопку вложения.
		 * @param {FBEditor.view.form.desc.AbstractFieldContainer} container Контейнер серии, из которой
		 * удалена вложенная серия.
		 */
		onRemoveFields: function (container)
		{
			var plugin,
				btn;

			if (container.getPlugin)
			{
				plugin = container.getPlugin('fieldcontainerreplicator');
				btn = plugin.getBtnPut();
				btn.enable();
			}
		},

		/**
		 * Удаляет кнопку добавления полей у вложенной серии и деактивирует кнопку вложения у родительской серии.
		 * @param {FBEditor.view.form.desc.AbstractFieldContainer} container Контейнер вложенной серии.
		 * @param {Ext.button.Button} ownerBtn Кнопка вложения родительской серии.
		 */
		onPutFields: function (container, ownerBtn)
		{
			var plugin = container.getPlugin('fieldcontainerreplicator'),
				btn;

			ownerBtn.disable();
			btn = plugin.getBtnAdd();
			btn.ownerCt.remove(btn);
		},

		onLoadData:  function (data)
		{
			var me = this,
				view = me.getView(),
				plugin;

			if (data)
			{
				data = data[0] ? data : {0: data};
				plugin = me.getPluginContainerReplicator(view);
				me.setValues(data, plugin);
			}
		},

		/**
		 * Вкладывает новые поля в родительский контейнер.
		 *
		 * @param {Object} data Данные.
		 * @param {Ext.container.Container} container Контейнер.
		 */
		onPutData:  function (data, container)
		{
			var me = this,
				plugin;

			data = data[0] ? data : {0: data};
			plugin = container.getPlugin('fieldcontainerreplicator');
			me.setValues(data, plugin);
		},

		/**
		 * Устанавливает значения полей.
		 *
		 * @param {Object} data Данные.
		 * @param {FBEditor.ux.FieldContainerReplicator} plug Плагин.
		 */
		setValues: function (data, plug)
		{
			var nextContainer = plug.getCmp(),
				plugin = plug;

			Ext.Object.each(
				data,
				function (index, item)
				{
					var field,
						putContainer;

					field = nextContainer.query('[name=sequence-id]')[0];
					field.setValue(item.id);
					field = nextContainer.query('[name=sequence-number]')[0];
					field.setValue(item.number ? item.number : '');
					field = nextContainer.query('[name=sequence-title-main]')[0];
					field.setValue(item.title.main);
					field = nextContainer.query('[name=sequence-title-sub]')[0];
					field.setValue(item.title.sub ? item.title.sub : '');
					if (item.title.alt)
					{
						field = nextContainer.query('[name=sequence-title-alt]')[0];
						field.fireEvent('loadData', item.title.alt);
					}
					if (item.sequence)
					{
						putContainer = plugin.putFields();
						putContainer.fireEvent('putData', item.sequence);
					}
					if (data[parseInt(index) + 1])
					{
						plugin.addFields();
						nextContainer = nextContainer.nextSibling();
						plugin = nextContainer.getPlugin('fieldcontainerreplicator');
					}
				}
			);
		}
	}
);
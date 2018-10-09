/**
 * Контроллер формы описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.DescController',
	{
		extend: 'Ext.app.ViewController',
		requires: [
			'FBEditor.converter.desc.Data'
		],
		
		alias: 'controller.form.desc',

		/**
		 * Загружает данные в форму.
		 * @param {Object} data Преобразованные данные, полученные из книги.
		 */
		onLoadData:  function (data)
		{
			var me = this,
				view = me.getView(),
				form = view.getForm(),
				descManager = FBEditor.desc.Manager;

			view.fireEvent('reset');
			form.setValues(data);
			Ext.getCmp('form-desc-sequence').fireEvent('loadData', data.sequence);
			Ext.getCmp('form-desc-title').down('form-desc-title-alt').fireEvent('loadData', data['title-alt']);
			Ext.getCmp('form-desc-periodical').down('form-desc-title-alt').
			fireEvent('loadData', data['periodical-title-alt']);

			if (data.relations && data.relations['relations-subject'])
			{
				Ext.getCmp('form-desc-relations-subject').fireEvent('loadData', data.relations['relations-subject']);
			}

			if (data.relations && data.relations['relations-object'])
			{
				Ext.getCmp('form-desc-relations-object').fireEvent('loadData', data.relations['relations-object']);
			}

			Ext.getCmp('form-desc-classification-udc').fireEvent('loadData', data['classification-udc']);
			Ext.getCmp('form-desc-classification-bbk').fireEvent('loadData', data['classification-bbk']);
			Ext.getCmp('form-desc-subject').fireEvent('loadData', data['classification-subject']);
			Ext.getCmp('form-desc-customInfo').fireEvent('loadData', data['custom-info']);
			Ext.getCmp('form-desc-publishInfo').fireEvent('loadData', data['paper-publish-info']);
			Ext.getCmp('form-desc-documentInfo-isbn').fireEvent('loadData', data['document-info-isbn']);

			me.expandFieldset(data);

			// устанавливаем флаг загрузки данных в форму
			descManager.setLoadedData(true);
		},

		/**
		 * Выполняется в момент начала скролинга.
		 */
		onStartScroll: function ()
		{
			var me = this,
				wins = me._scrollWins || [];

			// TODO рефакторинг
			// окна
			if (!me._scrollWins)
			{
				wins = Ext.ComponentQuery.query('form-desc-searchField-window');
				wins.push(Ext.getCmp('form-desc-subject-win') || Ext.widget('form-desc-subject-win'));
				me._scrollWins = wins;
			}

			Ext.Array.each(
				wins,
				function (item)
				{
					if (item)
					{
						item.close();
					}
				}
			);
		},

		/**
		 * Xаб доступен.
		 */
		onAccessHub: function ()
		{
			var bridgeProps = FBEditor.getBridgeProps(),
				cmpArr = [
					Ext.getCmp('form-desc-relations-subject'),
					Ext.getCmp('form-desc-relations-object')
				];

			if (bridgeProps && bridgeProps.Ext.getCmp)
			{
				cmpArr.push(bridgeProps.Ext.getCmp('panel-props-desc'));
			}

			Ext.Array.each(
				cmpArr,
			    function (cmp)
			    {
				    if (cmp)
				    {
					    cmp.fireEvent('accessHub');
				    }
			    }
			);
		},

		/**
		 * Вызывается при изменении размеров контейнера.
		 * @param {FBEditor.view.form.desc.Desc} cmp Описание.
		 * @param {Number} width
		 * @param {Number} height
		 * @param {Number} oldWidth
		 * @param {Number} oldHeight
		 */
		onResize: function (cmp, width, height, oldWidth, oldHeight)
		{
			var me = this,
				wins = me._resizeWins || [];

			if (!me._resizeWins)
			{
				wins = Ext.ComponentQuery.query('form-desc-relations-subject-searchName-resultContainer');
				wins.push(Ext.getCmp('form-desc-subject-win') || Ext.widget('form-desc-subject-win'));
				me._resizeWins = wins;
			}

			if (width !== oldWidth)
			{
				Ext.Array.each(
					wins,
					function (item)
					{
						if (item)
						{
							item.fireEvent('alignTo');
						}
					}
				);
			}
		},

		/**
		 * Выполняется после активации панели.
		 * @param {FBEditor.view.form.desc.Desc} self
		 */
		onActivate: function (self)
		{
			var me = self,
				items = me.items;

			if (!me._firstActivate)
			{
				me._firstActivate = true;
				items.each(
					function (item)
					{
						var req = item.require,
							autoExpand = item.autoExpand,
							collapsed;

						collapsed = req && autoExpand ? false : true;
						if (collapsed)
						{
							item.collapse();
						}
					}
				);
			}
		},

		/**
		 * Сбрасывает поля и блоки формы.
		 */
		onReset:  function ()
		{
			var me = this,
				view = me.getView(),
				form = view.getForm(),
				fieldContainers;

			// передаем событие resetFields всем необходимым компонентам
			fieldContainers = view.query('[name=form-desc-plugin-fieldcontainerreplicator],' +
			                             'form-desc-title, fieldset, form-desc-relations-subject-link');
			Ext.each(
				fieldContainers,
			    function (item)
			    {
				    item.fireEvent('resetFields');
			    }
			);

			// очищаем поля формы
			form.reset();
		},

		/**
		 * Разворачивает необязательные блоки fieldset, в которых есть данные.
		 * @param {Object} data Данные.
		 */
		expandFieldset: function (data)
		{
			var me = this,
				view = me.getView(),
				fields;

			fields = view.query('fieldset');
			Ext.each(
				fields,
				function (item)
				{
					item.fireEvent('checkExpand');
				}
			);
		}
	}
);
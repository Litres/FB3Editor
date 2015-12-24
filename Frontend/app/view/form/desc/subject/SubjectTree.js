/**
 * Список жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectTree',
	{
		extend: 'Ext.tree.Panel',
		requires: [
			'FBEditor.view.form.desc.subject.SubjectTreeController',
			'FBEditor.view.form.desc.subject.SubjectStore'
		],
		id: 'form-desc-subjectTree',
		xtype: 'form-desc-subjectTree',
		controller: 'form.desc.subjectTree',
		resizable: true,
		floating: true,
		//closable: true,
		closeAction: 'hide',
		//title: 'Выберите жанр',
		width: 450,
		height: 300,
		minHeight: 200,
		maxHeight: 500,
		autoScroll: true,
		rootVisible: false,
		animate: false,
		useArrows: true,
		folderSort: true,

		displayField: '_title',

		listeners: {
			filter: 'onFilter',
			click: {
				element: 'el',
				fn: 'onClick'
			},
			itemClick: 'onItemClick',
			alignTo: 'onAlignTo',
			resize: 'onResize'
		},

		/**
		 * @property {Number} Время обновления данных в локальном хранилище. По прошествии этого времени будет
		 * отправлен запрос на получение дерева жанров.
		 * Указывать в секундах.
		 */
		updateDataTime: 60 * 60 * 24,

		/**
		 * @property {Boolean} Открыт ли список.
		 */
		isShow: false,

		/**
		 * @property {FBEditor.view.form.desc.subject.Subject} Поле жанра.
		 */
		subjectView: null,

		/**
		 * @private
		 * @property {String} Название узла в объектной модели, который хранит потомков. Берется из хранилища.
		 */
		defaultRootProperty: '',

		/**
		 * @private
		 * @property {Boolean} Загружены ли уже данные.
		 */
		dataLoaded: false,

		/**
		 * @private
		 * @property {Boolean} Успешно ли загружены данные.
		 */
		errorLoaded: false,

		/**
		 * @private
		 * @property {Object} Данные дерева.
		 */
		cacheData: null,

		/**
		 * @private
		 * @property {Object} Кэш отфильтрованных данных.
		 */
		cacheFilteredData: {},

		/**
		 * @private
		 * @property {Number} Хранит позицию скролла, для его корректировки после открытия/закртыия узлов дерева.
		 */
		scrollTop: 0,

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.form.desc.subject.SubjectStore');
			me.store = store;
			me.defaultRootProperty = store.getDefaultRootProperty();

			me.callParent(arguments);
		},

		afterLayout: function ()
		{
			var me = this,
				view = me.getView(),
				el = view.getEl();

			// восстанавливаем позицию скролла после открытия/закрытия узла дерева
			el.setScrollTop(me.scrollTop);
		},

		handleFocusEnter: function (e)
		{
			var me = this,
				view = me.getView();

			// сохраняем позицию скролла
			me.scrollTop = view.getEl().getScrollTop();

			me.callParent(arguments);
		},

		show: function ()
		{
			var me = this,
				textfield,
				val;

			if (me.subjectView)
			{
				me.callParent(arguments);

				me.fireEvent('alignTo');

				me.isShow = true;

				// фильтруем значение
				textfield = me.getTextField();
				val = textfield.getValue();
				me.filterData(val);

				// фокус в конец текстового поля
				textfield.focusToEnd();
			}
		},

		afterShow: function()
		{
			var me = this;

			// добавляем обработчик события клика по всему документу, чтобы иметь возможность закрывать окно
			Ext.getBody().on('click', me.onClickBody, me);

			me.callParent(arguments);
		},

		afterHide: function ()
		{
			var me = this,
				textfield = me.getTextField();

			me.isShow = false;
			me.getRootNode().collapse(true);

			// удаляем обработчки клика по всему документу, чтобы не висел зря
			Ext.getBody().un('click', me.onClickBody, me);

			me.callParent(arguments);

			textfield.focusToEnd();

			// сбрасываем позицию скролла в начало
			me.scrollTop = 0;
		},

		/**
		 * Закрываем окно при нажатии на Esc.
		 */
		onEsc: function ()
		{
			var me = this;

			me.close();
		},

		/**
		 * Закрывает список, если клик произошел не по области списка и при этом не происходит изменение размеров
		 * дерева.
		 */
		onClickBody: function (e, input)
		{
			var me = this;

			// isShow ставится в false при изменении размеров окна, чтобы оно не закрылось (см. контроллер #onResize())
			if (!me.isShow)
			{
				me.isShow = true;
			}
			else
			{
				me.close();
			}

		},

		/**
		 * Проверяет данные и показывает окно.
		 */
		initData: function()
		{
			var me = this,
				text,
				data;

			if (!me.dataLoaded)
			{
				// загружаем данные

				data = me.getLocalData();
				text = data ? data.data : null;

				if (!data || data && data.timeIsOver)
				{
					// делаем запрос на получение новых данных дерева
					me.requestTree(text);
				}
				else
				{
					// загружаем локальные данные
					me.loadData(text);
				}
			}
			else
			{
				// показываем окно
				me.show();
			}
		},

		/**
		 * Отправляет запрос на получение дерева жанров.
		 * @param {String} text Xml-строка дерева из локального хранилища.
		 */
		requestTree: function (text)
		{
			var me = this;

			Ext.Ajax.request(
				{
					url: 'https://hub.litres.ru/genres_list_2/',
					timeout: 5000,
					scope: me,
					success: function (response)
					{
						var me = this,
							text = response.responseText;

						// сохраняем
						me.saveToLocal(text);

						// загружаем полученные данные
						me.loadData(text);
						me.errorLoaded = false;
					},
					failure: function (response)
					{
						console.log('Не удалось загрузить дерево жанров с удаленного ресурса', response);

						// загружаем локальные данные
						me.loadData(text);
						me.errorLoaded = true;
					}
				}
			);
		},

		/**
		 * Загружает данные дерева в хранилище.
		 * @param {String} text Xml-строка.
		 */
		loadData: function (text)
		{
			var me = this,
				store = me.getStore(),
				json,
				rootTreeData;

			if (me.errorLoaded)
			{
				// дерево уже пытались загрузить, игнорируем
				return;
			}

			if (!text)
			{
				Ext.Msg.alert(
					{
						title: 'Ошибка дерева жанров',
						message: 'Не удалось выполнить первичную загрузку дерева жанров. ' +
						         'Возможно, отсутствует подключение к интернету или браузер блокирует запрос.' +
						         ' Введите жанры вручную.',
						icon: Ext.Msg.ERROR
					}
				);
				Ext.log({msg: 'Ошибка загрузки дерева жанров', level: 'error'});

				return;
			}

			json = FBEditor.util.xml.Json.xmlToJson(text);

			rootTreeData = me.getTreeData(json.genres.genre);
			me.cacheData = Ext.clone(rootTreeData);
			store.loadData(rootTreeData);
			me.fireEvent('afterLoadData');
			//console.log('load data', rootTreeData);

			me.dataLoaded = true;
			me.show();
		},

		/**
		 * Возвращает данные из локалки.
		 * @return {String} Object.data Данные жанров в виде xml-строки.
		 * @return {Number} Object.time Время последнего сохранения данных.
		 */
		getLocalData: function ()
		{
			var me = this,
				storage = FBEditor.getLocalStorage(),
				intervalTime,
				data;

			data = storage.getItem(me.id);
			data = Ext.JSON.decode(data);

			if (data)
			{
				// прошедшее количество времени с момента последнего сохранения (в секундах)
				intervalTime =  (new Date().getTime() - data.time) / 1000;

				// истек ли срок хранения данных
				data.timeIsOver = intervalTime > me.updateDataTime;
			}

			return data;
		},

		/**
		 * Сохраняет заргуженные данные жанров локально.
		 * @param {String} text Данные жанров в виде xml-строки.
		 */
		saveToLocal: function (text)
		{
			var me = this,
				storage = FBEditor.getLocalStorage(),
				data;

			data = {
				time: new Date().getTime(),
				data: text
			};
			storage.setItem(me.id, Ext.JSON.encode(data));
		},

		/**
		 * Возвращает данные дерева, полученные путем переработки загруженных данных жанров.
		 * @param {Object} data Загруженные данные жанров.
		 * @return {Ext.data.NodeInterface[]} Данные дерева.
		 */
		getTreeData: function (data)
		{
			var me = this,
				rootTreeData,
				treeChildren;

			treeChildren = me.getTreeChildren(data);

			rootTreeData = {
				root: true,
				expandable: false,
				icon: ' ',
				cls: 'treenavigation-root treenavigation-root-genres',
				_id: 'root'
			};
			rootTreeData[me.defaultRootProperty] = treeChildren;
			//console.log('rootTreeData', rootTreeData);

			return [rootTreeData];
		},

		/**
		 * Рекурсивная функция, возвращающая данные всех потомков для дерева.
		 * @param {Array} data Потомки.
		 * @param {String} parentPath Путь родителя в дереве навигации.
		 * @return {Array} Структура дерева потомков.
		 */
		getTreeChildren: function (data, parentPath)
		{
			var me = this,
				sort = true,
				buf,
				i;

			// сортируем потомков
			while (data.length > 1 && sort)
			{
				sort = false;

				for (i = 0; i < data.length - 1; i++)
				{
					if (me.sortFn(data[i], data[i + 1]))
					{
						buf = Ext.clone(data[i]);
						data[i] = data[i + 1];
						data[i + 1] = buf;
						sort = true;
					}
				}
			}

			Ext.Array.each(
				data,
			    function (item)
			    {
				    var children = item[me.defaultRootProperty];

				    // полный путь элемента в дереве навигации
				    parentPath = parentPath || '';
				    item.path = parentPath + '/' + item._id;
				    item.icon = ' ';
				    item[me.displayField] = Ext.String.capitalize(item[me.displayField]);

				    if (children)
				    {
					    children = me.getTreeChildren(children, item.path);
					    item.cls = 'treenavigation-children treenavigation-children-genres';
				    }
				    else
				    {
					    item.leaf = true;
					    item.cls = 'treenavigation-children treenavigation-leaf-genres';
				    }
			    }
			);


			return data;
		},

		/**
		 * @private
		 * Используется в сортировке для определения необходимости поменять соседние жанры местами.
		 * @param {Object} rec1 Данные жанра.
		 * @param {Object} rec2 Данные следующего жанра.
		 * @return {Boolean} Необходимо ли поменять местами жанры.
		 */
		sortFn: function (rec1, rec2)
		{
			var me = this,
				field = me.displayField,
				childrenField = me.defaultRootProperty,
				change = false;

			//console.log(rec1[field], rec1[childrenField], rec2[field], rec2[childrenField]);
			if (rec2[childrenField] && rec1[childrenField] || !rec2[childrenField] && !rec1[childrenField])
			{
				change = rec1[field] > rec2[field] ? true : false;
			}
			else if (!rec1[childrenField] && rec2[childrenField])
			{
				change = true;
			}

			return change;
		},

		/**
		 * Возвращает данные жанра по его значению.
		 * @param {String} val Значение жанра.
		 * @return {Object} Данные жанра.
		 */
		getItemByValue: function (val)
		{
			var me = this,
				store = me.getStore(),
				itemStore = null;

			store.findBy(
				function (rec)
				{
					var data = rec.data,
						text = data[me.displayField],
						children = data[me.defaultRootProperty];

					if (text === val)
					{
						itemStore = data;

						return true;
					}

					if (children)
					{
						itemStore = me._findItemByValue(val, children);

						return itemStore ? true : false;
					}
				}
			);

			return itemStore;
		},

		/**
		 * @private
		 * Ищет данные записи в потомках узла по названию.
		 * @param {String} val Название.
		 * @param {Array} data Потомки узла.
		 * @return {Object} Данные записи.
		 */
		_findItemByValue: function (val, data)
		{
			var me = this,
				itemStore = null;

			Ext.Array.each(
				data,
				function (item)
				{
					var text = item[me.displayField],
						children = item[me.defaultRootProperty];

					if (text === val)
					{
						itemStore = item;

						return false;
					}

					if (children)
					{
						itemStore = me._findItemByValue(val, children);

						if (itemStore)
						{
							return false;
						}
					}
				}
			);

			return itemStore;
		},

		/**
		 * Переписывает стандартный метод, возвращающий корневой узел.
		 * @return {Ext.data.TreeModel} Корневой узел.
		 */
		getRootNode: function ()
		{
			var me = this,
				store= me.store,
				root;

			root = store && store.first() ? store.first() : me.callParent();

			return root;
		},

		/**
		 * Возвращает текстовое поле.
		 * @return {FBEditor.view.form.desc.subject.field.SubjectField}
		 */
		getTextField: function ()
		{
			var me = this,
				textfield;

			textfield = me.subjectView.down('form-desc-subject-field');

			return textfield;
		},

		/**
		 * Фильтрует дерево.
		 * @param {String} value Значение для фильтрации.
		 */
		filterData: function (value)
		{
			var me = this,
				store = me.getStore(),
				val = value.toLowerCase(),
				data = Ext.clone(me.cacheData),
				maxChildrenGenres = 3,
				filteredData;

			if (!data || me.filterProcess)
			{
				return;
			}

			// идет процесс фильтрации
			me.filterProcess = true;
			me.setLoading();

			// фильтруем данные
			if (val && !/^[0-9]+$/.test(val) && /[\wа-яА-Я]{2,}/.test(val))
			{
				if (!me.cacheFilteredData[val])
				{
					// фильтруем данные
					filteredData = me.filterFn(val, data[0]);

					// сохраняем в кэш результаты фильтрации
					me.cacheFilteredData[val] = Ext.clone(filteredData);
				}
				else
				{
					// из кэша
					filteredData = Ext.clone(me.cacheFilteredData[val]);
				}

				if (filteredData)
				{
					// загружаем данные в хранилище
					store.loadData([filteredData]);

					me.getRootNode().expand();

					// это условие необходимо, чтобы браузер не повис при большом количестве узлов,
					// которые будут открываться
					if (filteredData.genre.length > maxChildrenGenres)
					{
						// раскрываем только первые потомки корневого узла
						me.getRootNode().expandChildren();
					}
					else{
						// раскрываем все узлы
						me.getRootNode().expand(true);
					}
				}
			}
			else
			{
				store.loadData(data);

				// раскрываем только корневой узел
				me.getRootNode().expand();
			}

			// процесс фильтрации закончен
			me.filterProcess = false;
			me.setLoading(false);
		},

		/**
		 * @private
		 * Фильтрует данные жанров.
		 * @param {String} val Фильтрующее значение.
		 * @param {Object} data Данные узла.
		 * @return {Object} Отфильтрованные данные.
		 */
		filterFn: function (val, data)
		{
			var me = this,
				filteredData = null,
				reg,
				text;

			text = data[me.displayField] ? data[me.displayField].toLowerCase() : null;
			reg = new RegExp('^' + val + '|[^а-яa-z0-9]' + val, 'i');

			if (text && reg.test(text))
			{
				// клонируем
				filteredData = Ext.clone(data);
			}
			else if (!data.leaf)
			{
				// клонируем
				filteredData = Ext.clone(data);

				// удаляем потомков
				delete filteredData[me.defaultRootProperty];

				Ext.Array.each(
					data[me.defaultRootProperty],
					function (item)
					{
						var filteredItem = me.filterFn(val, Ext.clone(item));

						if (filteredItem)
						{
							// инициализируем свойство потомков
							filteredData[me.defaultRootProperty] = !filteredData[me.defaultRootProperty] ? [] :
							                                       filteredData[me.defaultRootProperty];

							// добавляем потомка
							filteredData[me.defaultRootProperty].push(filteredItem);
						}
					}
				);

				// если потомков нет, то игнорируем узел
				filteredData = filteredData[me.defaultRootProperty] ? filteredData : null;
			}

			return filteredData;
		}
	}
);
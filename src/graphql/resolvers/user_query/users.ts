import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import filterParamUtil from './user_filter';
import orderByFilter from './user_orderBy';
import { User } from '@talawa-api/models';
import { userExists } from '@talawa-api/utils';
import { QueryResolvers } from '../generatedTypes';

// Query to provide logged user information
export const me: QueryResolvers['me'] = async (parent, args, context) => {
  const user = await User.findOne({
    _id: context.userId,
  })
    .populate('createdOrganizations')
    .populate('createdEvents')
    .populate('joinedOrganizations')
    .populate('registeredEvents')
    .populate('eventAdmin')
    .populate('adminFor');
  if (!user) {
    throw new NotFoundError(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  return {
    ...user._doc,
    password: null,
  };
};

// Display the basic info of any user
// Query doesn't allow to see the blocked by organization
export const user: QueryResolvers['user'] = async (parent, args, context) => {
  let userFound = await userExists(context.userId);
  if (!userFound) throw new Error('User not found');

  const user = await User.findOne({ _id: args.id }).populate('adminFor');

  return {
    ...user?._doc,
    organizationsBlockedBy: [],
  };
};

// The query displays the list of users
// Query doesn't allow to see the blocked by organization
export const users: QueryResolvers['users'] = async (parent, args) => {
  let sort = {};
  let inputArg = {};
  let isSortingExecuted = args.orderBy !== null;
  const filterParam = args.where;

  if (filterParam) {
    inputArg = filterParamUtil(filterParam);
  }

  if (isSortingExecuted) {
    sort = orderByFilter(args.orderBy);
  }

  const users = await User.find(inputArg)
    .sort(sort)
    .populate('createdOrganizations')
    .populate('createdEvents')
    .populate('joinedOrganizations')
    .populate('registeredEvents')
    .populate('eventAdmin')
    .populate('adminFor');
  if (!users[0]) {
    throw new NotFoundError(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  } else
    return users.map((user) => {
      return {
        ...user._doc,
        password: null,
        organizationsBlockedBy: [],
      };
    });
};

export const usersConnection: QueryResolvers['usersConnection'] = async (
  parent,
  args
) => {
  var inputArg = {};
  var isSortingExecuted = args.orderBy !== null;
  const filterParam = args.where;

  if (filterParam) {
    inputArg = filterParamUtil(filterParam);
  }

  var sort = {};
  if (isSortingExecuted) {
    sort = orderByFilter(args.orderBy);
  }

  const users = await User.find(inputArg)
    .sort(sort)
    .limit(args.first)
    .skip(args.skip)
    .populate('createdOrganizations')
    .populate('createdEvents')
    .populate('joinedOrganizations')
    .populate('registeredEvents')
    .populate('eventAdmin')
    .populate('adminFor');

  return users.map((user) => {
    return {
      ...user._doc,
      password: null,
    };
  });
};

export const organizationsMemberConnection: QueryResolvers['organizationsMemberConnection'] =
  async (parent, args) => {
    var inputArg = {};
    var sort = {};

    if (args.where) {
      inputArg = filterParamUtil(args.where);
    }

    if (args.orderBy) {
      sort = orderByFilter(args.orderBy);
    }

    // Pagination based Options
    var options = {};
    if (args.first) {
      if (args.skip === null) {
        throw 'Missing Skip parameter. Set it to either 0 or some other value';
      }

      options = {
        lean: true,
        sort: sort,
        pagination: true,
        page: args.skip,
        limit: args.first,
      };
    } else {
      options = {
        sort: sort,
        pagination: false,
      };
    }

    const usersModel = await User.paginate(
      {
        joinedOrganizations: {
          _id: args.orgId,
        },
        ...inputArg,
      },
      options
    );

    var users = {};
    if (options.pagination) {
      if (args.skip === undefined) {
        throw new Error('Skip parameter is missing');
      }

      users = usersModel.docs.map((user) => {
        return {
          ...user,
          password: null,
        };
      });
    } else {
      users = usersModel.docs.map((user) => {
        return {
          ...user._doc,
          password: null,
        };
      });
    }

    return {
      pageInfo: {
        hasNextPage: usersModel.hasNextPage,
        hasPreviousPage: usersModel.hasPrevPage,
        totalPages: usersModel.totalPages,
        nextPageNo: usersModel.nextPage,
        prevPageNo: usersModel.prevPage,
        currPageNo: usersModel.page,
      },
      edges: users,
      aggregate: {
        count: usersModel.totalDocs,
      },
    };
  };

export default {
  me,
  user,
  users,
  usersConnection,
  organizationsMemberConnection,
};

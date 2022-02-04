import { createContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
// utils
import HttpService from '../utils/HttpService';
import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------
const httpservice = new HttpService();
const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  UPDATE: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    }
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  updateProfile: () => Promise.resolve()
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isRendered = useRef(false);

  useEffect(() => {
    isRendered.current = true;
    const ac = new AbortController();
    const initialize = () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          httpservice.get('/account/my-account').then(response => {
            const { user } = response.data;
            localStorage.setItem('user',JSON.stringify(user));
            if(isRendered.current){
              dispatch({
                type: 'INITIALIZE',
                payload: {
                  isAuthenticated: true,
                  user
                }
              }); 
            }
          }).catch(err => console.error(err));
        } else {
       
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error('err', err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
    return () => {
      isRendered.current = false;
    };
  }, []);

  const login = async (email, password) => {
    const response = await httpservice.post('/auth/login', {
      email,
      password
    });
    const { accessToken, user } = response.data;
    setSession(accessToken);
    localStorage.setItem('user',JSON.stringify(user));

    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });

  };

  const register = async (email, password, firstName, lastName) => {
    const response = await httpservice.post('/auth/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    setSession(null);
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = () => { };

  const updateProfile = async (firstName, lastName, email, userName,
    phoneNumber, password, country, photoURL) => {

    const formdata = new FormData();
    formdata.append('ImageProfile', photoURL, photoURL.name);
    formdata.append('password', password);
    formdata.append('email', email);
    formdata.append('firstName', firstName);
    formdata.append('lastName', lastName);
    formdata.append('country', country);
    formdata.append('userName', userName);
    formdata.append('phoneNumber', phoneNumber);

    const response = await httpservice.put('/account/my-account', formdata);

    const { user } = response.data;
    localStorage.setItem('user',JSON.stringify(user));

    dispatch({
      type: 'UPDATE',
      payload: {
        user
      }
    })
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };


